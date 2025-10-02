import { IsString, IsOptional, IsDateString } from 'class-validator';

export class GetTrackingDto {
  @IsString()
  bookingId: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
