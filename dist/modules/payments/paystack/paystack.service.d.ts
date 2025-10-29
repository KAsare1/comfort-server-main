import { ConfigService } from '@nestjs/config';
import { PaystackInitializeResponse, PaystackVerifyResponse } from './paystack.interface';
export declare class PaystackService {
    private configService;
    private httpClient;
    private config;
    constructor(configService: ConfigService);
    initializePayment(email: string, amount: number, reference: string, callbackUrl?: string, metadata?: any): Promise<PaystackInitializeResponse>;
    verifyPayment(reference: string): Promise<PaystackVerifyResponse>;
    getAllTransactions(page?: number, perPage?: number, status?: string, from?: string, to?: string): Promise<any>;
    refundTransaction(transactionId: string, amount?: number): Promise<any>;
}
