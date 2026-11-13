import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async createCustomer(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.userModel.exists({ email: normalizedEmail });
    if (existingUser) throw new ConflictException('Email is already registered');

    const user = await this.userModel.create({
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: UserRole.CUSTOMER,
    });
    return this.toSafeUser(user);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async ensureAdmin(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const existingAdmin = await this.userModel.findOne({ email: normalizedEmail }).exec();
    if (existingAdmin) return;

    await this.userModel.create({
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: UserRole.ADMIN,
    });
  }

  toSafeUser(user: UserDocument | User) {
    return { id: user._id.toString(), email: user.email, role: user.role };
  }
}
