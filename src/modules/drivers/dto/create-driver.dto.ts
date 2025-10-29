import {
  IsString,
  IsPhoneNumber,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus } from 'src/shared/enums';

export class CreateDriverDto {
  @ApiProperty({
    description: 'The name of the driver',
    example: 'Kwame Mensah',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The phone number of the driver (Ghana format)',
    example: '+233201234567',
  })
  @IsPhoneNumber('GH')
  phone: string;

  @ApiProperty({
    description: 'The email address of the driver',
    example: 'kwame.mensah@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The driver license number',
    example: 'GH-DL-123456',
  })
  @IsString()
  licenseNumber: string;

  @ApiProperty({
    description: 'The driver license expiry date',
    example: '2026-12-31',
  })
  @IsDateString()
  licenseExpiry: string;

  @ApiProperty({
    description: 'The current status of the driver',
    enum: DriverStatus,
    default: DriverStatus.OFFLINE,
    required: false,
  })
  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus = DriverStatus.OFFLINE;

  @ApiProperty({
    description: 'Driver documents as key-value pairs (document type: URL)',
    example: {
      license: 'https://example.com/license.pdf',
      insurance: 'https://example.com/insurance.pdf',
    },
    required: false,
  })
  @IsOptional()
  documents?: Record<string, string>;
}
