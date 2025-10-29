// src/database/entities/vehicle.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Driver } from './driver.entity';
import { VehicleStatus } from 'src/shared/enums';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  licensePlate: string;

  @Column({ type: 'varchar', length: 50 })
  make: string;

  @Column({ type: 'varchar', length: 50 })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 20 })
  color: string;

  @Column({ type: 'int', default: 4 })
  capacity: number;

  @Column({ type: 'int', default: 4 })
  totalSeats: number;

  @Column({ type: 'int', default: 4 })
  seatsAvailable: number;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
  })
  status: VehicleStatus;

  @Column({ type: 'varchar', length: 17, nullable: true })
  vin: string;

  @Column({ type: 'date', nullable: true })
  insuranceExpiry: Date;

  @Column({ type: 'date', nullable: true })
  roadworthinessExpiry: Date;

  @Column({ type: 'jsonb', nullable: true })
  features: string[]; // AC, GPS, etc.

  @OneToOne(() => Driver, (driver) => driver.vehicle)
  driver: Driver;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
