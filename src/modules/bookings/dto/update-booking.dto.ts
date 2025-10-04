import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from 'src/shared/enums';

export class UpdateBookingDto {
  @ApiProperty({
    description: 'The updated status of the booking',
    enum: BookingStatus,
    required: false,
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({
    description: 'The ID of the assigned driver',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsString()
  @IsOptional()
  driverId?: string;

  @ApiProperty({
    description: 'Updated notes or special requests',
    example: 'Customer requested a larger vehicle',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Updated scheduled pickup date and time',
    example: '2025-10-20T14:30:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
}