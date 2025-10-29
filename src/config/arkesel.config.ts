// src/config/arkesel.config.ts
import { ConfigService } from '@nestjs/config';

export interface ArkeselConfig {
  apiKey: string;
  senderId: string;
  baseUrl: string;
}

export const getArkeselConfig = (
  configService: ConfigService,
): ArkeselConfig => {
  const apiKey = configService.get<string>('ARKESEL_API_KEY');
  if (!apiKey) {
    throw new Error('Missing required environment variable: ARKESEL_API_KEY');
  }
  return {
    apiKey,
    senderId: configService.get<string>('ARKESEL_SENDER_ID', 'COMFORT'),
    baseUrl: 'https://sms.arkesel.com/api/v2',
  };
};
