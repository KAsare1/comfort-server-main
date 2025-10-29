// entities/driver-location.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

@Entity('driver_locations')
@Index(['driverId', 'timestamp'])
export class DriverLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  driverId: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  speed: number | null;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  heading: number | null;

  @Column('decimal', { precision: 6, scale: 2, nullable: true })
  accuracy: number | null;

  @Column('timestamp')
  @Index()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Optional: Relation to Driver entity
  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver?: Driver;
}