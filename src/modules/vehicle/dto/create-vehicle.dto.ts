import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsDateString, Min, Max } from 'class-validator';
import { VehicleStatus } from 'src/shared/enums';

export class CreateVehicleDto {
  @IsString()
  licensePlate: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsString()
  color: string;

  @IsNumber()
  @Min(1)
  @Max(8)
  capacity: number;

  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus = VehicleStatus.ACTIVE;

  @IsString()
  @IsOptional()
  vin?: string;

  @IsDateString()
  @IsOptional()
  insuranceExpiry?: string;

  @IsDateString()
  @IsOptional()
  roadworthinessExpiry?: string;

  @IsArray()
  @IsOptional()
  features?: string[];
}