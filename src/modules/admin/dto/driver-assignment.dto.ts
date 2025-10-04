import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AssignmentStrategy {
  NEAREST = 'nearest',
  MANUAL = 'manual',
  ROUND_ROBIN = 'round_robin',
  RATING_BASED = 'rating_based',
}

export class DriverAssignmentDto {
  @ApiProperty({
    description: 'The ID of the booking',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  bookingId: string;

  @ApiProperty({
    description: 'The strategy to use for driver assignment',
    enum: AssignmentStrategy,
    example: AssignmentStrategy.NEAREST,
  })
  @IsEnum(AssignmentStrategy)
  strategy: AssignmentStrategy;

  @ApiProperty({
    description: 'The ID of the driver (required for manual assignment)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsString()
  @IsOptional()
  driverId?: string;
}