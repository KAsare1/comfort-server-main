import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { BookingStatus } from 'src/shared/enums';

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsString()
  @IsOptional()
  driverId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
}


