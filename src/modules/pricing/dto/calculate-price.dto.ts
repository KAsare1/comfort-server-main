// src/modules/pricing/dto/calculate-price.dto.ts
// This is now the same as calculate-fare.dto.ts for consistency
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripType } from 'src/shared/enums';

export class CalculatePriceDto {
  @ApiProperty({
    description: 'The main pickup location',
    example: 'Sofoline',
    enum: ['Sofoline', 'Kwadaso', 'Asuoyeboah', 'Tanoso', 'Abuakwa', 'Adum', 'Kejetia']
  })
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @ApiProperty({
    description: 'The main dropoff location',
    example: 'Adum',
    enum: ['Sofoline', 'Kwadaso', 'Asuoyeboah', 'Tanoso', 'Abuakwa', 'Adum', 'Kejetia']
  })
  @IsString()
  @IsNotEmpty()
  dropoffLocation: string;

  @ApiProperty({
    description: 'The type of trip',
    enum: TripType,
    example: TripType.ONE_WAY,
  })
  @IsEnum(TripType)
  @IsNotEmpty()
  tripType: TripType;
}