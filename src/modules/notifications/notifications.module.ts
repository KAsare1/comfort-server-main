import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SmsService } from './sms/sms.service';
import { ArkeselService } from './sms/arkesel.service';
import { EmailService } from './email/email.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SmsService, ArkeselService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}