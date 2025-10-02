import { IsString, IsPhoneNumber, IsEmail, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { DriverStatus } from 'src/shared/enums';

export class UpdateDriverDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsPhoneNumber('GH')
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsDateString()
  @IsOptional()
  licenseExpiry?: string;

  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  documents?: Record<string, string>;
}