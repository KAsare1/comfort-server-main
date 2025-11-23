import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentStatus } from 'src/shared/enums';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initializePayment(initializeDto: InitializePaymentDto): Promise<{
        payment: import("../../database/entities/payment.entity").Payment;
        authorizationUrl: string;
        accessCode: string;
    }>;
    verifyPayment(verifyDto: VerifyPaymentDto): Promise<import("../../database/entities/payment.entity").Payment>;
    getAllPayments(page?: string, limit?: string, status?: PaymentStatus, startDate?: string, endDate?: string): Promise<{
        data: import("../../database/entities/payment.entity").Payment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getPaymentStats(startDate?: string, endDate?: string): Promise<{
        totalPayments: number;
        statusCounts: any[];
        methodCounts: any[];
        totalRevenue: number;
    }>;
    findByReference(reference: string): Promise<import("../../database/entities/payment.entity").Payment>;
    findByBooking(bookingId: string): Promise<import("../../database/entities/payment.entity").Payment | null>;
    findById(id: string): Promise<import("../../database/entities/payment.entity").Payment>;
    refundPayment(id: string, body: {
        reason?: string;
    }): Promise<import("../../database/entities/payment.entity").Payment>;
}
