import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PricingModule } from '../pricing/pricing.module';
import { LocationsModule } from '../locations/locations.module';
import { Booking } from 'src/database/entities/booking.entity';
import { BookingsController } from './booking.controller';
import { BookingsService } from './booking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    UsersModule,
    PricingModule,
    LocationsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}