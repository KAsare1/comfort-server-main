import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum NotificationType {
  SMS = 'sms',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
}

export class SendNotificationDto {
  @IsString()
  recipient: string; // Phone number or email

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  subject?: string; // For email notifications

  @IsObject()
  @IsOptional()
  data?: Record<string, any>; // Additional data for templates
}
