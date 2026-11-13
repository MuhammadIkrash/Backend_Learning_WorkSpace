import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_TRANSITIONS, OrderStatus } from './order-status.enum';
import { Order, OrderDocument, OrderItem } from './schemas/order.schema';

const round2 = (n: number) => Math.round(n * 100) / 100;

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orders: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly products: Model<ProductDocument>,
  ) {}

  /**
   * Prices are ALWAYS read from the database - the client only sends productId + quantity.
   * Stock is reserved with an atomic conditional $inc, so two customers can't oversell the last unit.
   * (Standalone MongoDB has no multi-document transactions, so failures are rolled back manually.)
   */
  async create(customerId: string, dto: CreateOrderDto) {
    const wanted = new Map<string, number>();
    for (const i of dto.items) wanted.set(i.productId, (wanted.get(i.productId) ?? 0) + i.quantity);

    const reserved: { product: Types.ObjectId; quantity: number }[] = [];
    const items: OrderItem[] = [];

    try {
      for (const [productId, quantity] of wanted) {
        const product = await this.products.findOneAndUpdate(
          { _id: productId, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { new: true },
        );
        if (!product) {
          const exists = await this.products.exists({ _id: productId });
          throw exists
            ? new BadRequestException(`Insufficient stock for product ${productId}`)
            : new NotFoundException(`Product ${productId} not found`);
        }
        reserved.push({ product: product._id, quantity });
        items.push({ product: product._id, name: product.name, unitPrice: product.price, quantity });
      }

      const totalPrice = round2(items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));
      return await this.orders.create({
        customer: new Types.ObjectId(customerId),
        items,
        totalPrice,
        status: OrderStatus.Pending,
      });
    } catch (err) {
      await this.restoreStock(reserved);
      throw err;
    }
  }

  findAll(status?: OrderStatus) {
    return this.orders
      .find(status ? { status } : {})
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  findMine(userId: string) {
    return this.orders.find({ customer: userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, user: AuthUser) {
    const order = await this.orders.findById(id).exec();
    if (!order) throw new NotFoundException('Order not found');
    if (user.role !== Role.Admin && order.customer.toString() !== user.userId) {
      throw new ForbiddenException('You can only view your own orders');
    }
    if (user.role === Role.Admin) await order.populate('customer', 'name email');
    return order;
  }

  /** Admin: move an order through its lifecycle. */
  async updateStatus(id: string, next: OrderStatus) {
    const order = await this.orders.findById(id).exec();
    if (!order) throw new NotFoundException('Order not found');
    return this.transition(order, next);
  }

  /** Customer: cancel their own order while it's still pending. */
  async cancelOwn(id: string, userId: string) {
    const order = await this.orders.findOne({ _id: id, customer: userId }).exec();
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.Pending) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }
    return this.transition(order, OrderStatus.Cancelled);
  }

  private async transition(order: OrderDocument, next: OrderStatus) {
    if (!ORDER_TRANSITIONS[order.status].includes(next)) {
      throw new BadRequestException(`Cannot change status from "${order.status}" to "${next}"`);
    }
    // Compare-and-set on the current status so concurrent requests can't both succeed
    // (which would e.g. restore stock twice on a double cancel).
    const updated = await this.orders
      .findOneAndUpdate({ _id: order._id, status: order.status }, { status: next }, { new: true })
      .exec();
    if (!updated) throw new BadRequestException('Order was modified by another request, please retry');

    if (next === OrderStatus.Cancelled) await this.restoreStock(updated.items);
    return updated;
  }

  private async restoreStock(list: { product: Types.ObjectId; quantity: number }[]) {
    await Promise.all(
      list.map((r) => this.products.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } })),
    );
  }
}
