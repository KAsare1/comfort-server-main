import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Booking } from 'src/database/entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from 'src/shared/enums';
import { CompleteTripDto } from './dto/complete-trip.dto';
import { PaymentsService } from '../payments/payments.service';
import { SmsService } from '../notifications/sms/sms.service';
import { VehiclesService } from '../vehicle/vehicle.service';
import { DriversService } from '../drivers/drivers.service';
import { BatchService } from '../batches/batch.service';
export declare class BookingsService {
    private bookingsRepository;
    private usersService;
    private paymentsService;
    private smsService;
    private vehiclesService;
    private driversService;
    private batchService;
    completeTripsForDriver(driverId: string, dto: CompleteTripDto): Promise<{
        message: string;
        bookingIds: string[];
    }>;
    private readonly pricingMatrix;
    constructor(bookingsRepository: Repository<Booking>, usersService: UsersService, paymentsService: PaymentsService, smsService: SmsService, vehiclesService: VehiclesService, driversService: DriversService, batchService: BatchService);
    private calculateFare;
    create(createBookingDto: CreateBookingDto): Promise<{
        booking: Booking;
        paymentInitResponse?: any;
    }>;
    findAll(): Promise<Booking[]>;
    findById(id: string): Promise<Booking>;
    findByReference(reference: string): Promise<Booking>;
    findByCustomer(customerId: string): Promise<Booking[]>;
    findByDriver(driverId: string): Promise<Booking[]>;
    updateStatus(id: string, status: BookingStatus, metadata?: Record<string, any>): Promise<Booking>;
    private checkAndCompleteBatchIfAllBookingsCompleted;
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
        pickupStop?: string;
        dropoffLocation?: string;
        dropoffStop?: string;
    }): Promise<Booking>;
    getBookingsByDepartureDate(departureDate: string): Promise<Booking[]>;
}
