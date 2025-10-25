import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from 'src/shared/enums';

export class UpdateVehicleDto {
  @ApiProperty({
    description: 'The updated license plate number',
    example: 'GH-5678-21',
    required: false,
  })
  @IsString()
  @IsOptional()
  licensePlate?: string;

  @ApiProperty({
    description: 'The updated make/manufacturer',
    example: 'Honda',
    required: false,
  })
  @IsString()
  @IsOptional()
  make?: string;

  @ApiProperty({
    description: 'The updated model',
    example: 'Civic',
    required: false,
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    description: 'The updated manufacturing year',
    example: 2023,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1,
    required: false,
  })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  year?: number;

  @ApiProperty({
    description: 'The updated color',
    example: 'Black',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'The updated passenger capacity',
    example: 5,
    minimum: 1,
    maximum: 8,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(8)
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    description: 'Updated total number of seats',
    example: 5,
    minimum: 1,
    maximum: 20,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  totalSeats?: number;

  @ApiProperty({
    description: 'Updated number of seats available',
    example: 3,
    minimum: 0,
    maximum: 20,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(20)
  @IsOptional()
  seatsAvailable?: number;

  @ApiProperty({
    description: 'The updated status of the vehicle',
    enum: VehicleStatus,
    required: false,
  })
  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;

  @ApiProperty({
    description: 'The updated VIN',
    example: '1HGBH41JXMN109187',
    required: false,
  })
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiProperty({
    description: 'The updated insurance expiry date',
    example: '2026-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  insuranceExpiry?: string;

  @ApiProperty({
    description: 'The updated roadworthiness expiry date',
    example: '2026-06-30',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  roadworthinessExpiry?: string;

  @ApiProperty({
    description: 'Updated list of vehicle features',
    example: ['Air Conditioning', 'GPS', 'Bluetooth', 'Heated Seats'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  features?: string[];
}