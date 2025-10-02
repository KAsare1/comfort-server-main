// src/database/entities/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
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

  @ManyToOne(() => User, user => user.bookings)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Driver, driver => driver.bookings, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({ type: 'varchar', length: 200 })
  pickupLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  pickupLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  pickupLongitude: number;

  @Column({ type: 'varchar', length: 200 })
  dropoffLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  dropoffLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  dropoffLongitude: number;

  @Column({ type: 'time' })
  pickupTime: string;

  @Column({ type: 'time', nullable: true })
  dropoffTime: string;

  @Column({ 
    type: 'enum', 
    enum: TripType, 
    default: TripType.SINGLE 
  })
  tripType: TripType;

  @Column({ type: 'jsonb' })
  bookingDates: string[]; // Array of date strings

  @Column({ 
    type: 'enum', 
    enum: BookingStatus, 
    default: BookingStatus.PENDING 
  })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance: number; // in kilometers

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number; // in minutes

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  route: Record<string, any>; // Mapbox route data

  @OneToOne(() => Payment, payment => payment.booking)
  payment: Payment;

  @OneToMany(() => TrackingData, tracking => tracking.booking)
  trackingData: TrackingData[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
