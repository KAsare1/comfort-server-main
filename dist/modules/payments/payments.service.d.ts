import { Repository } from 'typeorm';
import { PaystackService } from './paystack/paystack.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Payment } from 'src/database/entities/payment.entity';
import { BookingsService } from '../bookings/booking.service';
import { PaymentStatus } from 'src/shared/enums';
export declare class PaymentsService {
    private paymentsRepository;
    private bookingsService;
    private paystackService;
    constructor(paymentsRepository: Repository<Payment>, bookingsService: BookingsService, paystackService: PaystackService);
    initializePayment(initializeDto: InitializePaymentDto): Promise<{
        payment: Payment;
        authorizationUrl: string;
        accessCode: string;
    }>;
    verifyPayment(verifyDto: VerifyPaymentDto): Promise<Payment>;
    findById(id: string): Promise<Payment>;
    findByReference(reference: string): Promise<Payment>;
    findByBooking(bookingId: string): Promise<Payment | null>;
    getAllPayments(page?: number, limit?: number, status?: PaymentStatus, startDate?: Date, endDate?: Date): Promise<{
        data: Payment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getPaymentStats(startDate?: Date, endDate?: Date): Promise<{
        totalPayments: number;
        statusCounts: any[];
        methodCounts: any[];
        totalRevenue: number;
    }>;
    refundPayment(paymentId: string, reason?: string): Promise<Payment>;
}
