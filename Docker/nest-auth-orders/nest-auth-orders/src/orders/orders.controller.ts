import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  @Roles(Role.Customer)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.orders.create(user.userId, dto);
  }

  // NOTE: 'my' must be declared before ':id'
  @Get('my')
  @Roles(Role.Customer)
  findMine(@CurrentUser() user: AuthUser) {
    return this.orders.findMine(user.userId);
  }

  @Get()
  @Roles(Role.Admin)
  findAll(@Query() query: QueryOrdersDto) {
    return this.orders.findAll(query.status);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Customer)
  findOne(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.orders.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(Role.Admin)
  updateStatus(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, dto.status);
  }

  @Patch(':id/cancel')
  @Roles(Role.Customer)
  cancel(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.orders.cancelOwn(id, user.userId);
  }
}
