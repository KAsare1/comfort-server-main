import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class GeocodeDto {
  @IsString()
  query: string;

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  proximity_lat?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  proximity_lng?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  limit?: number;
}