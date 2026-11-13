import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';
import { UsersSeed } from './users.on-module-init';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, { provide: UsersSeed, useFactory: (users: UsersService, config: ConfigService) => new UsersSeed(users, config), inject: [UsersService, ConfigService] }],
  exports: [UsersService],
})
export class UsersModule {}
