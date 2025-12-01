import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from 'src/database/entities/batch.entity';
import { Booking } from 'src/database/entities/booking.entity';
import { Driver } from 'src/database/entities/driver.entity';
import { Vehicle } from 'src/database/entities/vehicle.entity';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { DriversModule } from '../drivers/drivers.module';
import { VehiclesModule } from '../vehicle/vehicle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Batch, Booking, Driver, Vehicle]),
    forwardRef(() => DriversModule),
    forwardRef(() => VehiclesModule),
  ],
  providers: [BatchService],
  controllers: [BatchController],
  exports: [BatchService],
})
export class BatchModule {}
