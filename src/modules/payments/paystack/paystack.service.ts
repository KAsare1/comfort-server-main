import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PaystackInitializeResponse, PaystackVerifyResponse } from './paystack.interface';
import { getPaystackConfig } from 'src/config/paystack.config';

@Injectable()
export class PaystackService {
  private httpClient: AxiosInstance;
  private config;

  constructor(private configService: ConfigService) {
    this.config = getPaystackConfig(this.configService);
    
    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        Authorization: `Bearer ${this.config.secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async initializePayment(
    email: string,
    amount: number,
    reference: string,
    callbackUrl?: string,
    metadata?: any,
  ): Promise<PaystackInitializeResponse> {
    try {
      const response = await this.httpClient.post('/transaction/initialize', {
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        callback_url: callbackUrl,
        metadata,
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Paystack initialization failed: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await this.httpClient.get(`/transaction/verify/${reference}`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Paystack verification failed: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllTransactions(
    page: number = 1,
    perPage: number = 50,
    status?: string,
    from?: string,
    to?: string,
  ) {
    try {
      const params = {
        page,
        perPage,
        ...(status && { status }),
        ...(from && { from }),
        ...(to && { to }),
      };

      const response = await this.httpClient.get('/transaction', { params });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch transactions: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async refundTransaction(transactionId: string, amount?: number) {
    try {
      const response = await this.httpClient.post('/refund', {
        transaction: transactionId,
        ...(amount && { amount: amount * 100 }), // Convert to kobo if provided
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Refund failed: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
