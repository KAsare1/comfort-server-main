import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsDateString, Min, Max } from 'class-validator';
import { VehicleStatus } from 'src/shared/enums';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  licensePlate?: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @Min(1)
  @Max(8)
  @IsOptional()
  capacity?: number;

  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;

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