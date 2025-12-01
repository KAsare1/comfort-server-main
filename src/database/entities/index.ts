import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';
import { Batch } from './batch.entity';
import { Payment } from './payment.entity';
import { Location } from './location.entity';
import { TrackingData } from './tracking.entity';
import { User } from './user.entity';

export const entities = [
  User,
  Driver,
  Vehicle,
  Booking,
  Batch,
  Payment,
  Location,
  TrackingData,
];

export { Batch, BatchStatus } from './batch.entity';