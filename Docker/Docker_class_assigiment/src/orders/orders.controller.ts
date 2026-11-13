import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsEnum, IsInt, IsMongoId, Min } from 'class-validator';
import { Roles } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.schema';
import { OrderStatus } from './order.schema';
import { OrdersService } from './orders.service';

class OrderLineDto {
  @IsMongoId() productId: string;
  @IsInt() @Min(1) quantity: number;
}
class CreateOrderDto { items: OrderLineDto[]; }
class UpdateStatusDto { @IsEnum(OrderStatus) status: OrderStatus; }

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  create(@Req() request: any, @Body() dto: CreateOrderDto) { return this.ordersService.create(request.user._id.toString(), dto.items); }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() { return this.ordersService.findAll(); }

  @Get('my')
  @Roles(UserRole.CUSTOMER)
  findMine(@Req() request: any) { return this.ordersService.findMine(request.user._id.toString()); }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) { return this.ordersService.updateStatus(id, dto.status); }
}
