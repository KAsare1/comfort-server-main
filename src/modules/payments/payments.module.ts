import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaystackService } from './paystack/paystack.service';
import { BookingsModule } from '../bookings/bookings.module';
import { Payment } from 'src/database/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    BookingsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaystackService],
  exports: [PaymentsService, PaystackService],
})
export class PaymentsModule {}
