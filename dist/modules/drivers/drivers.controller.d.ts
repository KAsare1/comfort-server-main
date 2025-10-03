import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriverStatus } from 'src/shared/enums';
import { DriverQueryDto } from './dto/driver-query.dto';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    create(createDriverDto: CreateDriverDto): Promise<import("../../database/entities/driver.entity").Driver>;
    findAll(): Promise<import("../../database/entities/driver.entity").Driver[]>;
    findAvailable(): Promise<import("../../database/entities/driver.entity").Driver[]>;
    findNearby(lat: string, lng: string, radius?: string): Promise<(import("../../database/entities/driver.entity").Driver & {
        distance: number;
    })[]>;
    findOne(id: string): Promise<import("../../database/entities/driver.entity").Driver>;
    getStats(id: string): Promise<{
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
    updateLocation(id: string, locationDto: UpdateDriverLocationDto): Promise<import("../../database/entities/driver.entity").Driver>;
    updateStatus(id: string, body: {
        status: DriverStatus;
    }): Promise<import("../../database/entities/driver.entity").Driver>;
    assignToBooking(id: string, body: {
        bookingId: string;
    }): Promise<import("../../database/entities/driver.entity").Driver>;
    completeTrip(id: string): Promise<import("../../database/entities/driver.entity").Driver>;
    updateRating(id: string, body: {
        rating: number;
    }): Promise<import("../../database/entities/driver.entity").Driver>;
    remove(id: string): Promise<void>;
    findWithPagination(queryDto: DriverQueryDto): Promise<{
        data: import("../../database/entities/driver.entity").Driver[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getOverallStats(): Promise<{
        totalDrivers: number;
        statusCounts: any[];
        averageRating: number;
        topDrivers: import("../../database/entities/driver.entity").Driver[];
    }>;
    getExpiringLicenses(days?: string): Promise<import("../../database/entities/driver.entity").Driver[]>;
    updateDocuments(id: string, body: {
        documents: Record<string, string>;
    }): Promise<import("../../database/entities/driver.entity").Driver>;
}
