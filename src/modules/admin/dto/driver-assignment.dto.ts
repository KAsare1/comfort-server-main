import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum AssignmentStrategy {
  NEAREST = 'nearest',
  MANUAL = 'manual',
  ROUND_ROBIN = 'round_robin',
  RATING_BASED = 'rating_based',
}

export class DriverAssignmentDto {
  @IsString()
  bookingId: string;

  @IsEnum(AssignmentStrategy)
  strategy: AssignmentStrategy;

  @IsString()
  @IsOptional()
  driverId?: string; // Required for manual assignment
}
