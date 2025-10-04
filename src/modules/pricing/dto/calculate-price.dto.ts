import { IsNumber, IsEnum, IsArray, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripType } from 'src/shared/enums';

export class CalculatePriceDto {
  @ApiProperty({
    description: 'The latitude of the pickup location',
    example: 5.6037,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickupLatitude: number;

  @ApiProperty({
    description: 'The longitude of the pickup location',
    example: -0.1870,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  pickupLongitude: number;

  @ApiProperty({
    description: 'The latitude of the dropoff location',
    example: 5.5560,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  dropoffLatitude: number;

  @ApiProperty({
    description: 'The longitude of the dropoff location',
    example: -0.1969,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  dropoffLongitude: number;

  @ApiProperty({
    description: 'The type of trip',
    enum: TripType,
    example: TripType.SINGLE,
  })
  @IsEnum(TripType)
  tripType: TripType;

  @ApiProperty({
    description: 'Array of booking dates in ISO format',
    example: ['2025-10-15', '2025-10-16'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  bookingDates: string[];

  @ApiProperty({
    description: 'The pickup time in HH:mm format',
    example: '14:30',
  })
  @IsString()
  pickupTime: string;

  @ApiProperty({
    description: 'The estimated duration of the trip in minutes',
    example: 45,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedDuration?: number;

  @ApiProperty({
    description: 'The distance of the trip in kilometers',
    example: 12.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number;
}