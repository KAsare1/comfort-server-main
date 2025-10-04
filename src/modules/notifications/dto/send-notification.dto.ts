import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
  SMS = 'sms',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
}

export class SendNotificationDto {
  @ApiProperty({
    description: 'The recipient phone number or email address',
    example: '+233201234567',
  })
  @IsString()
  recipient: string;

  @ApiProperty({
    description: 'The type of notification to send',
    enum: NotificationType,
    example: NotificationType.SMS,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'The notification message content',
    example: 'Your booking has been confirmed',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The subject line for email notifications',
    example: 'Booking Confirmation',
    required: false,
  })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({
    description: 'Additional data for notification templates',
    example: { bookingId: '12345', driverName: 'John Doe' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}