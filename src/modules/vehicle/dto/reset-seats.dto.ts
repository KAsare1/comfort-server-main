import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

/**
 * @fileoverview
 * DTO for resetting available seats of a vehicle
 *
 * @remarks
 * Used in the reset available seats endpoint for vehicles.
 */
export class ResetSeatsDto {
  @ApiProperty({ description: 'Number of seats to reset to. If not provided, resets to totalSeats or capacity.' })
  @IsOptional()
  @IsInt()
  seats?: number;
}
