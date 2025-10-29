import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsString } from 'class-validator';

export class CompleteTripDto {
  @ApiProperty({
    description: 'Start date for trip completion range (YYYY-MM-DD)',
    required: false,
    example: '2025-10-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for trip completion range (YYYY-MM-DD)',
    required: false,
    example: '2025-10-29',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Wildcard to complete all trips for the driver',
    required: false,
    example: '*',
  })
  @IsOptional()
  @IsString()
  all?: string;
}
