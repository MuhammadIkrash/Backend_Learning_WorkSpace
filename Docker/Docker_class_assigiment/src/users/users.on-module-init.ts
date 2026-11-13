import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';

export class UsersSeed {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.usersService.ensureAdmin(
      this.configService.getOrThrow<string>('ADMIN_EMAIL'),
      this.configService.getOrThrow<string>('ADMIN_PASSWORD'),
    );
  }
}
