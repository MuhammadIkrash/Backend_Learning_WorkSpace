import { ConflictException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {}

  /** Seeds the first admin from ADMIN_EMAIL / ADMIN_PASSWORD (skipped if unset or already present). */
  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) {
      this.logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set - no admin will be seeded');
      return;
    }
    if (await this.model.exists({ email: email.toLowerCase() })) return;
    await this.model.create({
      name: this.config.get<string>('ADMIN_NAME') ?? 'Admin',
      email,
      password: await bcrypt.hash(password, 10),
      role: Role.Admin,
    });
    this.logger.log(`Seeded admin user ${email}`);
  }

  async create(data: { name: string; email: string; password: string; role: Role }) {
    try {
      return await this.model.create(data);
    } catch (e: any) {
      if (e?.code === 11000) throw new ConflictException('Email is already registered');
      throw e;
    }
  }

  findByEmailWithPassword(email: string) {
    return this.model.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }

  findById(id: string) {
    return this.model.findById(id).exec();
  }

  findAll() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }
}
