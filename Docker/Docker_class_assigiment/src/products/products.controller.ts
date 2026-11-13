import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Roles } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.schema';
import { ProductsService } from './products.service';

class ProductDto {
  @IsString() name: string;
  @IsString() description: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) stock: number;
  @IsString() category: string;
}

class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsNumber() @Min(0) stock?: number;
  @IsOptional() @IsString() category?: string;
}

@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: ProductDto) { return this.productsService.create(dto); }

  @Get()
  findAll() { return this.productsService.findAll(); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) { return this.productsService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.productsService.remove(id); }
}
