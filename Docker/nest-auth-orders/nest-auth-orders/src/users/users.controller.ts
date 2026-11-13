import { Controller, Get } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /** Any authenticated user. */
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const u = await this.users.findById(user.userId);
    return { id: u!.id, name: u!.name, email: u!.email, role: u!.role };
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.users.findAll();
  }
}
