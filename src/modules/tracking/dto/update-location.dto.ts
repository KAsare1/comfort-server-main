import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {

  @ApiProperty({
    description: 'The ID of the driver',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  driverId: string;

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
    example: -0.187,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({
    description: 'The speed of the vehicle in km/h',
    example: 45.5,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  speed?: number;

  @ApiProperty({
    description: 'The heading/direction of travel in degrees (0-360)',
    example: 180,
    minimum: 0,
    maximum: 360,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(360)
  heading?: number;

  @ApiProperty({
    description: 'The accuracy of the location reading in meters',
    example: 10,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  accuracy?: number;
}
