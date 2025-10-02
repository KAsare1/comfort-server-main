import { IsNumber, IsEnum, IsArray, IsString, IsOptional, Min, Max } from 'class-validator';
import { TripType } from 'src/shared/enums';

export class CalculatePriceDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickupLatitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  pickupLongitude: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  dropoffLatitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  dropoffLongitude: number;

  @IsEnum(TripType)
  tripType: TripType;

  @IsArray()
  @IsString({ each: true })
  bookingDates: string[];

  @IsString()
  pickupTime: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedDuration?: number; // in minutes

  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number; // in kilometers
}
