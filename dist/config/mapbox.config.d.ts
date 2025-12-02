import { ConfigService } from '@nestjs/config';
export interface MapboxConfig {
    accessToken: string;
    baseUrl: string;
    directionsUrl: string;
    geocodingUrl: string;
}
export declare const getMapboxConfig: (configService: ConfigService) => MapboxConfig;
