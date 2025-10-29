import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './booking.service';
import { BookingStatus } from 'src/shared/enums';
import { CompleteTripDto } from './dto/complete-trip.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    completeTripForDriver(driverId: string, body: CompleteTripDto): Promise<{
        message: string;
        bookingIds: string[];
    }>;
    create(createBookingDto: CreateBookingDto): Promise<{
        booking: import("../../database/entities/booking.entity").Booking;
        paymentInitResponse?: any;
    }>;
    findAll(): Promise<import("../../database/entities/booking.entity").Booking[]>;
    getActiveBookings(): Promise<import("../../database/entities/booking.entity").Booking[]>;
    getStats(startDate?: string, endDate?: string): Promise<{
        totalBookings: number;
        statusCounts: any[];
        totalRevenue: number;
    }>;
    findByReference(reference: string): Promise<import("../../database/entities/booking.entity").Booking>;
    findByCustomer(customerId: string): Promise<import("../../database/entities/booking.entity").Booking[]>;
    findByDriver(driverId: string): Promise<import("../../database/entities/booking.entity").Booking[]>;
    findOne(id: string): Promise<import("../../database/entities/booking.entity").Booking>;
    updateStatus(id: string, body: {
        status: BookingStatus;
        metadata?: Record<string, any>;
    }): Promise<import("../../database/entities/booking.entity").Booking>;
    assignDriver(id: string, body: {
        driverId: string;
    }): Promise<import("../../database/entities/booking.entity").Booking>;
    cancel(id: string, body?: {
        reason?: string;
    }): Promise<import("../../database/entities/booking.entity").Booking>;
    findWithPagination(queryDto: import('./dto/booking-query.dto').BookingQueryDto): Promise<{
        data: import("../../database/entities/booking.entity").Booking[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getUpcomingBookings(): Promise<import("../../database/entities/booking.entity").Booking[]>;
    getRecentBookings(limit?: string): Promise<import("../../database/entities/booking.entity").Booking[]>;
    updateLocation(id: string, locationData: {
        pickupLocation?: string;
        pickupLatitude?: number;
        pickupLongitude?: number;
        dropoffLocation?: string;
        dropoffLatitude?: number;
        dropoffLongitude?: number;
    }): Promise<import("../../database/entities/booking.entity").Booking>;
}
