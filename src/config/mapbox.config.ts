import { ConfigService } from '@nestjs/config';

export interface MapboxConfig {
  accessToken: string;
  baseUrl: string;
  directionsUrl: string;
  geocodingUrl: string;
}

/**
 * @fileoverview
 * Mapbox configuration provider for API endpoints and access token.
 *
 * @remarks
 * Ensures all required Mapbox configuration values are present and strictly typed.
 *
 * @see {@link /docs/mapbox.md | Mapbox Integration Documentation}
 */

/**
 * Retrieves Mapbox configuration from the environment.
 *
 * @param configService - NestJS ConfigService instance
 * @returns MapboxConfig object with validated values
 *
 * @throws {Error} If MAPBOX_ACCESS_TOKEN is missing
 */
export const getMapboxConfig = (configService: ConfigService): MapboxConfig => {
  const accessToken = configService.get<string>('MAPBOX_ACCESS_TOKEN');
  if (!accessToken) {
    throw new Error(
      'Missing required environment variable: MAPBOX_ACCESS_TOKEN',
    );
  }
  return {
    accessToken,
    baseUrl: 'https://api.mapbox.com',
    directionsUrl: 'https://api.mapbox.com/directions/v5/mapbox/driving',
    geocodingUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  };
};
