// src/database/entities/driver.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';
import { TrackingData } from './tracking.entity';
import { DriverStatus } from 'src/shared/enums';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  licenseNumber: string;

  @Column({ type: 'date' })
  licenseExpiry: Date;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.OFFLINE,
  })
  status: DriverStatus;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  currentLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  currentLongitude: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLocationUpdate: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  totalTrips: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  documents: Record<string, string>; // Store document URLs

  @OneToOne(() => Vehicle, (vehicle) => vehicle.driver)
  @JoinColumn()
  vehicle: Vehicle;

  @OneToMany(() => Booking, (booking) => booking.driver)
  bookings: Booking[];

  @OneToMany(() => TrackingData, (tracking) => tracking.driver)
  trackingData: TrackingData[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
