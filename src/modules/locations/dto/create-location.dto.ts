import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    description: 'The name of the location',
    example: 'Kotoka International Airport',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The street address of the location',
    example: 'Airport Rd, Accra',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'The latitude coordinate',
    example: 5.6037,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'The longitude coordinate',
    example: -0.1670,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({
    description: 'The city where the location is situated',
    example: 'Accra',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'The region where the location is situated',
    example: 'Greater Accra',
    required: false,
  })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({
    description: 'Whether this is a popular/frequently used location',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @ApiProperty({
    description: 'Additional metadata for the location',
    example: { placeType: 'airport', amenities: ['parking', 'wifi'] },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}