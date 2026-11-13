import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  create(data: Partial<Product>) {
    return this.productModel.create(data);
  }

  findAll() {
    return this.productModel.find().sort({ createdAt: -1 }).exec();
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.productModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted' };
  }

  async findByIds(ids: string[]) {
    return this.productModel.find({ _id: { $in: ids } }).exec();
  }
}
