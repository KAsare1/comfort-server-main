import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from 'src/shared/enums';

export class VehicleQueryDto {
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
    description: 'Filter vehicles by status',
    enum: VehicleStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiProperty({
    description: 'Filter vehicles by whether they have an assigned driver',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasDriver?: boolean;

  @ApiProperty({
    description: 'Search vehicles by license plate, make, or model',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter vehicles by make/manufacturer',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiProperty({
    description: 'Filter vehicles by manufacturing year',
    example: 2022,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;
}
