import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TrackingGateway } from './tracking.gateway';
import { BookingsModule } from '../bookings/bookings.module';
import { DriversModule } from '../drivers/drivers.module';
import { TrackingData } from 'src/database/entities/tracking.entity';
import { DriverLocation } from 'src/database/entities/driver-location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackingData, DriverLocation]),
    BookingsModule,
    DriversModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingGateway],
  exports: [TrackingService, TrackingGateway],
})
export class TrackingModule {}
