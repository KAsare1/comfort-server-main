export declare class CreateLocationDto {
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    city?: string;
    region?: string;
    isPopular?: boolean;
    metadata?: Record<string, any>;
}
