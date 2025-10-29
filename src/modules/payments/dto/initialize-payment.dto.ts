import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from 'src/shared/enums';

export class InitializePaymentDto {
  @ApiProperty({
    description: 'The ID of the booking',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  bookingId: string;

  @ApiProperty({
    description: 'The payment amount',
    example: 150.5,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'The payment method to use',
    enum: PaymentMethod,
    example: PaymentMethod.MOMO,
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    description: 'The customer email address for payment receipt',
    example: 'customer@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({
    description: 'The callback URL for payment confirmation',
    example: 'https://example.com/payment/callback',
    required: false,
  })
  @IsString()
  @IsOptional()
  callbackUrl?: string;
}
