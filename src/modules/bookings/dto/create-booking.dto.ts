import { IsString, IsNumber, IsArray, IsEnum, IsOptional, IsDateString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripType } from 'src/shared/enums';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The name of the customer',
    example: 'Ama Asante',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The phone number of the customer (Ghana format)',
    example: '+233201234567',
    pattern: '^\\+233[0-9]{9}$',
  })
  @IsString()
  @Matches(/^\+233[0-9]{9}$/, { message: 'Phone must be a valid Ghanaian number (+233XXXXXXXXX)' })
  phone: string;

  @ApiProperty({
    description: 'The pickup location address',
    example: 'Kotoka International Airport, Accra',
  })
  @IsString()
  pickupLocation: string;

  @ApiProperty({
    description: 'The pickup location latitude',
    example: 5.6037,
  })
  @IsNumber()
  pickupLatitude: number;

  @ApiProperty({
    description: 'The pickup location longitude',
    example: -0.1670,
  })
  @IsNumber()
  pickupLongitude: number;

  @ApiProperty({
    description: 'The dropoff location address',
    example: 'Kwame Nkrumah Circle, Accra',
  })
  @IsString()
  dropoffLocation: string;

  @ApiProperty({
    description: 'The dropoff location latitude',
    example: 5.5560,
  })
  @IsNumber()
  dropoffLatitude: number;

  @ApiProperty({
    description: 'The dropoff location longitude',
    example: -0.1969,
  })
  @IsNumber()
  dropoffLongitude: number;

  @ApiProperty({
    description: 'The pickup time in HH:MM format',
    example: '14:30',
    pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'pickupTime must be in HH:MM format' })
  pickupTime: string;

  @ApiProperty({
    description: 'The dropoff time in HH:MM format',
    example: '15:30',
    pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'dropoffTime must be in HH:MM format' })
  dropoffTime?: string;

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
  @IsDateString({}, { each: true })
  bookingDates: string[];

  @ApiProperty({
    description: 'Additional notes or special requests for the booking',
    example: 'Please bring a child seat',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}