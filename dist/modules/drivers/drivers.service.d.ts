import { Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Driver } from 'src/database/entities/driver.entity';
import { DriverStatus } from 'src/shared/enums';
import { DriverQueryDto } from './dto/driver-query.dto';
export declare class DriversService {
    private driversRepository;
    constructor(driversRepository: Repository<Driver>);
    create(createDriverDto: CreateDriverDto): Promise<Driver>;
    findAll(): Promise<Driver[]>;
    findById(id: string): Promise<Driver>;
    findByPhone(phone: string): Promise<Driver | null>;
    findAvailableDrivers(): Promise<Driver[]>;
    findNearbyDrivers(latitude: number, longitude: number, radiusKm?: number): Promise<Array<Driver & {
        distance: number;
    }>>;
    updateLocation(id: string, locationDto: UpdateDriverLocationDto): Promise<Driver>;
    updateStatus(id: string, status: DriverStatus): Promise<Driver>;
    assignToBooking(driverId: string, bookingId: string): Promise<Driver>;
    completeTrip(driverId: string): Promise<Driver>;
    updateRating(driverId: string, newRating: number): Promise<Driver>;
    getDriverStats(driverId: string): Promise<{
        driver: {
            id: string;
            name: string;
            rating: number;
            totalTrips: number;
            status: DriverStatus;
            vehicle: import("../../database/entities/vehicle.entity").Vehicle;
        };
        stats: {
            totalBookings: number;
            completedBookings: number;
            cancelledBookings: number;
            averageEarnings: number;
            totalEarnings: number;
            completionRate: number;
        };
    }>;
    deactivate(id: string): Promise<void>;
    findWithPagination(queryDto: DriverQueryDto): Promise<{
        data: Driver[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getOverallDriverStats(): Promise<{
        totalDrivers: number;
        statusCounts: any[];
        averageRating: number;
        topDrivers: Driver[];
    }>;
    getExpiringLicenses(daysAhead?: number): Promise<Driver[]>;
    updateDocuments(id: string, documents: Record<string, string>): Promise<Driver>;
}
