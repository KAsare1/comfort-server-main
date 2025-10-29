import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeocodeDto {
  @ApiProperty({
    description: 'The search query for geocoding (address or place name)',
    example: 'Kwame Nkrumah Circle, Accra',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Proximity bias latitude for search results',
    example: 5.6037,
    minimum: -90,
    maximum: 90,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  proximity_lat?: number;

  @ApiProperty({
    description: 'Proximity bias longitude for search results',
    example: -0.187,
    minimum: -180,
    maximum: 180,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  proximity_lng?: number;

  @ApiProperty({
    description: 'Maximum number of results to return',
    example: 5,
    minimum: 1,
    maximum: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  limit?: number;
}
