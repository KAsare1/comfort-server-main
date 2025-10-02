import { IsString, IsPhoneNumber, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/shared/enums';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsPhoneNumber('GH')
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;

  @IsOptional()
  preferences?: Record<string, any>;
}
