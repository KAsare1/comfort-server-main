import { Driver } from './driver.entity';
import { VehicleStatus } from 'src/shared/enums';
export declare class Vehicle {
    id: string;
    licensePlate: string;
    make: string;
    model: string;
    year: number;
    color: string;
    capacity: number;
    totalSeats: number;
    seatsAvailable: number;
    status: VehicleStatus;
    vin: string;
    insuranceExpiry: Date;
    roadworthinessExpiry: Date;
    features: string[];
    driver: Driver;
    createdAt: Date;
    updatedAt: Date;
}
