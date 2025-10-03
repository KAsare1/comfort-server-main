import { ConfigService } from '@nestjs/config';
export interface PaystackConfig {
    secretKey: string;
    publicKey: string;
    baseUrl: string;
}
export declare const getPaystackConfig: (configService: ConfigService) => PaystackConfig;
