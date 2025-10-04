import { IsString, IsPhoneNumber, IsEmail, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus } from 'src/shared/enums';

export class UpdateDriverDto {
  @ApiProperty({
    description: 'The updated name of the driver',
    example: 'Kwame Mensah',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The updated phone number (Ghana format)',
    example: '+233207654321',
    required: false,
  })
  @IsPhoneNumber('GH')
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'The updated email address',
    example: 'kwame.new@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The updated driver license number',
    example: 'GH-DL-654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({
    description: 'The updated license expiry date',
    example: '2027-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  licenseExpiry?: string;

  @ApiProperty({
    description: 'The updated status of the driver',
    enum: DriverStatus,
    required: false,
  })
  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus;

  @ApiProperty({
    description: 'Whether the driver account is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Updated driver documents as key-value pairs',
    example: { license: 'https://example.com/new-license.pdf' },
    required: false,
  })
  @IsOptional()
  documents?: Record<string, string>;
}