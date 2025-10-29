import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { DriversModule } from '../drivers/drivers.module';
import { PaymentsModule } from '../payments/payments.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TrackingModule } from '../tracking/tracking.module';
import { VehiclesModule } from '../vehicle/vehicle.module';

@Module({
  imports: [
    BookingsModule,
    DriversModule,
    VehiclesModule,
    PaymentsModule,
    UsersModule,
    NotificationsModule,
    TrackingModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
