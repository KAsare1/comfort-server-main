import { IsOptional, IsEnum, IsString, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus } from 'src/shared/enums';

export class DriverQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter drivers by status',
    enum: DriverStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  @ApiProperty({
    description: 'Filter drivers by whether they have an assigned vehicle',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasVehicle?: boolean;

  @ApiProperty({
    description: 'Search drivers by name, phone, or license number',
    example: 'Kwame',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}