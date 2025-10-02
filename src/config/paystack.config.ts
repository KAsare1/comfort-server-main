import { ConfigService } from '@nestjs/config';

export interface PaystackConfig {
  secretKey: string;
  publicKey: string;
  baseUrl: string;
}

export const getPaystackConfig = (configService: ConfigService): PaystackConfig => {
  const secretKey = configService.get<string>('PAYSTACK_SECRET_KEY');
  const publicKey = configService.get<string>('PAYSTACK_PUBLIC_KEY');

  if (!secretKey) {
    throw new Error('Missing PAYSTACK_SECRET_KEY in environment configuration');
  }
  if (!publicKey) {
    throw new Error('Missing PAYSTACK_PUBLIC_KEY in environment configuration');
  }

  return {
    secretKey,
    publicKey,
    baseUrl: 'https://api.paystack.co',
  };
};
