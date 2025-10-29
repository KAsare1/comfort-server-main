import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus, TripType } from 'src/shared/enums';

export class BookingQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter bookings by status',
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({
    description: 'Filter bookings by trip type',
    enum: TripType,
    required: false,
  })
  @IsOptional()
  @IsEnum(TripType)
  tripType?: TripType;

  @ApiProperty({
    description: 'Filter bookings by customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({
    description: 'Filter bookings by driver ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiProperty({
    description: 'Filter bookings from this start date',
    example: '2025-10-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Filter bookings until this end date',
    example: '2025-10-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Search bookings by reference, location, or customer name',
    example: 'Accra',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
