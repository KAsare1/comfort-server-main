import { IsArray, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class RouteDto {
  @IsArray()
  start: [number, number]; // [longitude, latitude]

  @IsArray()
  end: [number, number]; // [longitude, latitude]

  @IsEnum(['driving', 'walking', 'cycling'])
  @IsOptional()
  profile?: string = 'driving';

  @IsBoolean()
  @IsOptional()
  alternatives?: boolean = false;

  @IsBoolean()
  @IsOptional()
  steps?: boolean = true;

  @IsBoolean()
  @IsOptional()
  geometries?: boolean = true;
}
