import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsInt, IsMongoId, Min, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsMongoId()
  productId: string;

  @IsInt() @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray() @ArrayNotEmpty() @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
