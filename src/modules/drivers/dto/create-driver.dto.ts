import { IsString, IsPhoneNumber, IsEmail, IsOptional, IsDateString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { DriverStatus } from 'src/shared/enums';

export class CreateDriverDto {
  @IsString()
  name: string;

  @IsPhoneNumber('GH')
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  licenseNumber: string;

  @IsDateString()
  licenseExpiry: string;

  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus = DriverStatus.OFFLINE;

  @IsOptional()
  documents?: Record<string, string>;
}