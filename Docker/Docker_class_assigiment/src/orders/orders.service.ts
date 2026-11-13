import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductsService } from '../products/products.service';
import { Order, OrderDocument, OrderStatus } from './order.schema';

interface OrderLine { productId: string; quantity: number }

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async create(customerId: string, lines: OrderLine[]) {
    const products = await this.productsService.findByIds(lines.map((line) => line.productId));
    if (products.length !== lines.length) throw new BadRequestException('One or more products do not exist');

    const items = lines.map((line) => {
      const product = products.find((item) => item._id.toString() === line.productId);
      if (!product || product.stock < line.quantity) throw new BadRequestException(`Insufficient stock for ${line.productId}`);
      return { product: product._id, quantity: line.quantity, unitPrice: product.price };
    });
    const totalPrice = items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
    return this.orderModel.create({ customer: new Types.ObjectId(customerId), items, totalPrice });
  }

  findAll() { return this.orderModel.find().populate('customer', 'email').populate('items.product').sort({ createdAt: -1 }).exec(); }
  findMine(customerId: string) { return this.orderModel.find({ customer: customerId }).populate('items.product').sort({ createdAt: -1 }).exec(); }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
