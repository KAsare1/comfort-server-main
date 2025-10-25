// ...existing code...
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripType } from 'src/shared/enums';
import { PaymentMethod } from 'src/shared/enums';

export class CreateBookingDto {
  /**
   * Number of seats to book
   * @example 2
   */
  @ApiProperty({ description: 'Number of seats to book', example: 2, minimum: 1, required: false })
  @IsNumber()
  @IsOptional()
  seatsBooked?: number;
  /**
   * The name of the customer
   * @example "Ama Asante"
   */
  @ApiProperty({ description: 'The name of the customer', example: 'Ama Asante' })
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The phone number of the customer (Ghana format)
   * @example "+233201234567"
   */
  @ApiProperty({ description: 'The phone number of the customer (Ghana format)', example: '+233201234567', pattern: '^\\+233[0-9]{9}$' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  /**
   * Main pickup location (e.g., "Sofoline")
   * @example "Sofoline"
   */
  @ApiProperty({ description: 'Main pickup location', example: 'Sofoline' })
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  /**
   * Specific pickup stop (e.g., "Sofoline Main Station")
   * @example "Sofoline Main Station"
   */
  @ApiProperty({ description: 'Specific pickup stop', example: 'Sofoline Main Station' })
  @IsString()
  @IsNotEmpty()
  pickupStop: string;

  /**
   * Main dropoff location
   * @example "Adum"
   */
  @ApiProperty({ description: 'Main dropoff location', example: 'Adum' })
  @IsString()
  @IsNotEmpty()
  dropoffLocation: string;

  /**
   * Specific dropoff stop
   * @example "Adum Market"
   */
  @ApiProperty({ description: 'Specific dropoff stop', example: 'Adum Market' })
  @IsString()
  @IsNotEmpty()
  dropoffStop: string;

  /**
   * Departure time range (e.g., "05:30-05:45")
   * @example "05:30-05:45"
   */
  @ApiProperty({ description: 'Departure time range', example: '05:30-05:45', pattern: '^[0-2][0-9]:[0-5][0-9]-[0-2][0-9]:[0-5][0-9]$' })
  @IsString()
  @IsNotEmpty()
  departureTime: string;

  /**
   * Departure date (YYYY-MM-DD)
   * @example "2025-10-15"
   */
  @ApiProperty({ description: 'Departure date (YYYY-MM-DD)', example: '2025-10-15', pattern: '^\\d{4}-\\d{2}-\\d{2}$' })
  @IsDateString()
  @IsNotEmpty()
  departureDate: string;

  /**
   * Type of trip
   * @example TripType.ONE_WAY
   */
  @ApiProperty({ description: 'Type of trip', enum: TripType, example: TripType.ONE_WAY })
  @IsEnum(TripType)
  @IsNotEmpty()
  tripType: TripType;

  /**
   * Additional notes or special requests
   * @example "Please bring a child seat"
   */
  @ApiProperty({ description: 'Additional notes or special requests', example: 'Please bring a child seat', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  /**
   * Payment method (momo, visa, mastercard)
   * @example PaymentMethod.MOMO
   */
  @ApiProperty({ description: 'Payment method', enum: PaymentMethod, required: false })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}