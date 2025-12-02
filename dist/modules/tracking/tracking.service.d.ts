import { Repository } from 'typeorm';
import { DriversService } from '../drivers/drivers.service';
import { DriverLocation } from 'src/database/entities/driver-location.entity';
import { UpdateDriverLocationDto } from '../drivers/dto/update-driver-location.dto';
export declare class TrackingService {
    private driverLocationRepository;
    private driversService;
    constructor(driverLocationRepository: Repository<DriverLocation>, driversService: DriversService);
    updateDriverLocation(updateDto: UpdateDriverLocationDto): Promise<DriverLocation>;
    getDriverLatestLocation(driverId: string): Promise<DriverLocation | null>;
    getDriverTrackingInfo(driverId: string): Promise<{
        driver: any;
        location: DriverLocation | null;
    }>;
    getDriverLocationHistory(driverId: string, startDate?: Date, endDate?: Date): Promise<DriverLocation[]>;
    getAllActiveDriversLocations(): Promise<Array<{
        driver: any;
        location: DriverLocation | null;
    }>>;
    calculateDriverDistance(driverId: string, startDate: Date, endDate: Date): Promise<number>;
    getDriverTripSummary(driverId: string, startDate: Date, endDate: Date): Promise<{
        driverId: string;
        totalDistance: number;
        duration: number;
        averageSpeed: number;
        maxSpeed: number;
        startTime: null;
        endTime: null;
        totalPoints: number;
    } | {
        driverId: string;
        totalDistance: number;
        duration: number;
        averageSpeed: number;
        maxSpeed: number;
        startTime: Date;
        endTime: Date;
        totalPoints: number;
    }>;
    isDriverMoving(driverId: string): Promise<boolean>;
    getNearbyDrivers(latitude: number, longitude: number, radiusKm?: number): Promise<Array<{
        driver: any;
        location: DriverLocation;
        distance: number;
    }>>;
    cleanupOldLocations(daysToKeep?: number): Promise<number>;
    private haversineDistance;
    private deg2rad;
}
