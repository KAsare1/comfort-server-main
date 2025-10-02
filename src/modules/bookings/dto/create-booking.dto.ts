// src/modules/bookings/dto/create-booking.dto.ts
import { IsString, IsNumber, IsArray, IsEnum, IsOptional, IsDateString, Matches } from 'class-validator';
import { TripType } from 'src/shared/enums';

export class CreateBookingDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^\+233[0-9]{9}$/, { message: 'Phone must be a valid Ghanaian number (+233XXXXXXXXX)' })
  phone: string;

  @IsString()
  pickupLocation: string;

  @IsNumber()
  pickupLatitude: number;

  @IsNumber()
  pickupLongitude: number;

  @IsString()
  dropoffLocation: string;

  @IsNumber()
  dropoffLatitude: number;

  @IsNumber()
  dropoffLongitude: number;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'pickupTime must be in HH:MM format' })
  pickupTime: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'dropoffTime must be in HH:MM format' })
  dropoffTime?: string;

  @IsEnum(TripType)
  tripType: TripType;

  @IsArray()
  @IsDateString({}, { each: true })
  bookingDates: string[];

  @IsString()
  @IsOptional()
  notes?: string;
}