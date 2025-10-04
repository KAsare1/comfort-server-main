import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'The payment reference number to verify',
    example: 'PAY-123456789',
  })
  @IsString()
  reference: string;
}