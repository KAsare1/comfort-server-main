import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  bookingId: string;

  @IsString()
  driverId: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  speed?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(360)
  heading?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  accuracy?: number;
}
