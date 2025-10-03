import { ConfigService } from '@nestjs/config';
export declare const getRedisConfig: (configService: ConfigService) => {
    host: any;
    port: any;
    password: any;
    retryAttempts: number;
    retryDelay: number;
};
