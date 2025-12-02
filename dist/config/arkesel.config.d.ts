import { ConfigService } from '@nestjs/config';
export interface ArkeselConfig {
    apiKey: string;
    senderId: string;
    baseUrl: string;
}
export declare const getArkeselConfig: (configService: ConfigService) => ArkeselConfig;
