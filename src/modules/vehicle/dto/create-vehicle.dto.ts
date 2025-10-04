import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from 'src/shared/enums';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'The license plate number of the vehicle',
    example: 'GH-1234-20',
  })
  @IsString()
  licensePlate: string;

  @ApiProperty({
    description: 'The make/manufacturer of the vehicle',
    example: 'Toyota',
  })
  @IsString()
  make: string;

  @ApiProperty({
    description: 'The model of the vehicle',
    example: 'Corolla',
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'The year the vehicle was manufactured',
    example: 2022,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1,
  })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({
    description: 'The color of the vehicle',
    example: 'Silver',
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'The passenger capacity of the vehicle',
    example: 4,
    minimum: 1,
    maximum: 8,
  })
  @IsNumber()
  @Min(1)
  @Max(8)
  capacity: number;

  @ApiProperty({
    description: 'The current status of the vehicle',
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
    required: false,
  })
  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus = VehicleStatus.ACTIVE;

  @ApiProperty({
    description: 'The Vehicle Identification Number (VIN)',
    example: '1HGBH41JXMN109186',
    required: false,
  })
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiProperty({
    description: 'The insurance expiry date',
    example: '2025-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  insuranceExpiry?: string;

  @ApiProperty({
    description: 'The roadworthiness certificate expiry date',
    example: '2025-06-30',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  roadworthinessExpiry?: string;

  @ApiProperty({
    description: 'List of vehicle features',
    example: ['Air Conditioning', 'GPS', 'Bluetooth'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  features?: string[];
}