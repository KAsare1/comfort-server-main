import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';

export enum BatchStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Driver, (driver) => driver.batches, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ name: 'vehicle_id', nullable: true })
  vehicleId: string;

  /**
   * Pickup location for this batch
   * This becomes the dropoff location for the previous batch
   */
  @Column({ type: 'varchar', length: 100 })
  pickupLocation: string;

  /**
   * Specific pickup stop/point
   */
  @Column({ type: 'varchar', length: 200, nullable: true })
  pickupStop: string;

  /**
   * Dropoff location for this batch
   * All bookings in this batch must have this as their dropoff location
   */
  @Column({ type: 'varchar', length: 100 })
  dropoffLocation: string;

  /**
   * Specific dropoff stop/point
   */
  @Column({ type: 'varchar', length: 200, nullable: true })
  dropoffStop: string;

  /**
   * Status of the batch (active, completed, cancelled)
   */
  @Column({
    type: 'enum',
    enum: BatchStatus,
    default: BatchStatus.ACTIVE,
  })
  status: BatchStatus;

  /**
   * Total seats booked in this batch
   */
  @Column({ type: 'int', default: 0 })
  seatsBooked: number;

  /**
   * Total available seats for this batch (vehicle capacity)
   */
  @Column({ type: 'int', default: 4 })
  totalSeats: number;

  /**
   * Remaining available seats in this batch
   */
  @Column({ type: 'int', default: 4 })
  seatsAvailable: number;

  /**
   * Departure date for this batch
   */
  @Column({ type: 'date', nullable: true })
  departureDate: string;

  /**
   * Departure time range (e.g., "05:30-05:45")
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  departureTime: string;

  /**
   * Timestamp when batch was created (first booking assigned)
   */
  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  /**
   * Timestamp when batch was completed (all passengers dropped off)
   */
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  /**
   * Bookings in this batch
   */
  @OneToMany(() => Booking, (booking) => booking.batch)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
