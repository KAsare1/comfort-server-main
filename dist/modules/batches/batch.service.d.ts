import { Repository } from 'typeorm';
import { Batch, BatchStatus } from 'src/database/entities/batch.entity';
import { Booking } from 'src/database/entities/booking.entity';
import { Driver } from 'src/database/entities/driver.entity';
import { Vehicle } from 'src/database/entities/vehicle.entity';
import { DriversService } from '../drivers/drivers.service';
import { VehiclesService } from '../vehicle/vehicle.service';
export declare class BatchService {
    private batchRepository;
    private bookingRepository;
    private driverRepository;
    private vehicleRepository;
    private driversService;
    private vehiclesService;
    constructor(batchRepository: Repository<Batch>, bookingRepository: Repository<Booking>, driverRepository: Repository<Driver>, vehicleRepository: Repository<Vehicle>, driversService: DriversService, vehiclesService: VehiclesService);
    createBatch(driverId: string, vehicleId: string, pickupLocation: string, pickupStop: string | null, dropoffLocation: string, dropoffStop: string | null, departureDate: string, departureTime: string, seatsBooked: number, totalSeats: number): Promise<Batch>;
    addBookingToBatch(batchId: string, bookingId: string, seatsToAdd: number): Promise<Batch>;
    findById(id: string): Promise<Batch>;
    getActiveBatchesForDriver(driverId: string): Promise<Batch[]>;
    getCurrentBatchForDriver(driverId: string): Promise<Batch | null>;
    verifyBatchDropoffLocation(batchId: string, currentLocation: string): Promise<boolean>;
    completeBatch(batchId: string, dropoffLocation?: string): Promise<Batch>;
    cancelBatch(batchId: string, reason?: string): Promise<Batch>;
    getBatchByBookingReference(reference: string): Promise<Batch | null>;
    getBatchesForDriver(driverId: string, page?: number, limit?: number, status?: BatchStatus): Promise<{
        data: Batch[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    canAcceptMoreBookings(driverId: string): Promise<{
        canAccept: boolean;
        currentBatch?: Batch;
        reason?: string;
    }>;
}
