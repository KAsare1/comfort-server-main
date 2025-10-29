// src/database/entities/booking.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Payment } from './payment.entity';
import { TrackingData } from './tracking.entity';
import { User } from './user.entity';
import { Driver } from './driver.entity';
import { BookingStatus, TripType } from 'src/shared/enums';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  reference: string;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Driver, (driver) => driver.bookings, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  // Pickup location fields
  @Column({ type: 'varchar', length: 100, nullable: true })
  pickupLocation: string; // Main location (e.g., "Sofoline", "Kwadaso")

  @Column({ type: 'varchar', length: 200, nullable: true })
  pickupStop: string; // Specific stop (e.g., "Sofoline Main Station")

  // Dropoff location fields
  @Column({ type: 'varchar', length: 100, nullable: true })
  dropoffLocation: string; // Main location

  @Column({ type: 'varchar', length: 200, nullable: true })
  dropoffStop: string; // Specific stop

  // Time and date fields
  @Column({ type: 'varchar', length: 20, nullable: true })
  departureTime: string; // Time range (e.g., "05:30-05:45")

  @Column({ type: 'date', nullable: true })
  departureDate: string; // Departure date (YYYY-MM-DD)

  @Column({
    type: 'enum',
    enum: TripType,
    nullable: false,
  })
  tripType: TripType;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'int', default: 1 })
  seatsBooked: number;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;

  @OneToMany(() => TrackingData, (tracking) => tracking.booking)
  trackingData: TrackingData[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
