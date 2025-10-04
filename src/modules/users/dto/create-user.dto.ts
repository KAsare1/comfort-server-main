import { IsString, IsPhoneNumber, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/shared/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The phone number of the user (Ghana format)',
    example: '+233201234567',
  })
  @IsPhoneNumber('GH')
  phone: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    default: UserRole.CUSTOMER,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;

  @ApiProperty({
    description: 'User preferences as key-value pairs',
    example: { theme: 'dark', notifications: true },
    required: false,
  })
  @IsOptional()
  preferences?: Record<string, any>;
}