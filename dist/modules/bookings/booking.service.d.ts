import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Booking } from 'src/database/entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from 'src/shared/enums';
import { PricingService } from '../pricing/pricing.service';
import { LocationsService } from '../locations/locations.service';
export declare class BookingsService {
    private bookingsRepository;
    private usersService;
    private pricingService;
    private locationsService;
    constructor(bookingsRepository: Repository<Booking>, usersService: UsersService, pricingService: PricingService, locationsService: LocationsService);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findById(id: string): Promise<Booking>;
    findByReference(reference: string): Promise<Booking>;
    findByCustomer(customerId: string): Promise<Booking[]>;
    findByDriver(driverId: string): Promise<Booking[]>;
    updateStatus(id: string, status: BookingStatus, metadata?: Record<string, any>): Promise<Booking>;
    assignDriver(bookingId: string, driverId: string): Promise<Booking>;
    cancel(id: string, reason?: string): Promise<Booking>;
    getActiveBookings(): Promise<Booking[]>;
    getBookingStats(startDate?: Date, endDate?: Date): Promise<{
        totalBookings: number;
        statusCounts: any[];
        totalRevenue: number;
    }>;
    findWithPagination(queryDto: import('./dto/booking-query.dto').BookingQueryDto): Promise<{
        data: Booking[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
    getUpcomingBookings(): Promise<Booking[]>;
    getRecentBookings(limit?: number): Promise<Booking[]>;
    updateBookingLocation(id: string, locationData: {
        pickupLocation?: string;
        pickupLatitude?: number;
        pickupLongitude?: number;
        dropoffLocation?: string;
        dropoffLatitude?: number;
        dropoffLongitude?: number;
    }): Promise<Booking>;
}
