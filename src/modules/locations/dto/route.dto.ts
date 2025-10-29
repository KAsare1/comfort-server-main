import { IsArray, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RouteDto {
  @ApiProperty({
    description: 'The starting coordinates [longitude, latitude]',
    example: [-0.187, 5.6037],
    type: [Number],
  })
  @IsArray()
  start: [number, number];

  @ApiProperty({
    description: 'The ending coordinates [longitude, latitude]',
    example: [-0.1969, 5.556],
    type: [Number],
  })
  @IsArray()
  end: [number, number];

  @ApiProperty({
    description: 'The routing profile to use',
    enum: ['driving', 'walking', 'cycling'],
    example: 'driving',
    default: 'driving',
    required: false,
  })
  @IsEnum(['driving', 'walking', 'cycling'])
  @IsOptional()
  profile?: string = 'driving';

  @ApiProperty({
    description: 'Whether to return alternative routes',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  alternatives?: boolean = false;

  @ApiProperty({
    description: 'Whether to include step-by-step directions',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  steps?: boolean = true;

  @ApiProperty({
    description: 'Whether to include route geometries',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  geometries?: boolean = true;
}
