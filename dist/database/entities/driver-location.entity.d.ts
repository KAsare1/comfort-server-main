import { Driver } from './driver.entity';
export declare class DriverLocation {
    id: string;
    driverId: string;
    latitude: number;
    longitude: number;
    speed: number | null;
    heading: number | null;
    accuracy: number | null;
    timestamp: Date;
    createdAt: Date;
    driver?: Driver;
}
