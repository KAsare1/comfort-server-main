import { TripType } from 'src/shared/enums';
export declare class PricingService {
    private readonly pricingMatrix;
    private readonly locations;
    getBaseFare(pickupLocation: string, dropoffLocation: string): number;
    calculateFare(pickupLocation: string, dropoffLocation: string, tripType: TripType): number;
    getFareEstimate(pickupLocation: string, dropoffLocation: string, tripType: TripType): {
        fare: number;
        baseFare: number;
        tripType: TripType;
        multiplier: number;
        breakdown: {
            oneWayFare: number;
            roundTripMultiplier: number;
            totalFare: number;
        };
    };
    getAvailableLocations(): string[];
    getAllRoutes(): {
        from: string;
        to: string;
        fare: number;
    }[];
    isRouteAvailable(pickupLocation: string, dropoffLocation: string): boolean;
    getPricingMatrix(): {
        matrix: Record<string, Record<string, number>>;
        locations: string[];
    };
}
