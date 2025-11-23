import { PricingService } from './pricing.service';
import { TripType } from 'src/shared/enums';
import { CalculatePriceDto } from './dto/calculate-price.dto';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    calculateFare(calculateFareDto: CalculatePriceDto): {
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
    getEstimate(pickupLocation: string, dropoffLocation: string, tripType?: string): {
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
    getLocations(): {
        locations: string[];
    };
    getAllRoutes(): {
        routes: {
            from: string;
            to: string;
            fare: number;
        }[];
    };
    getPricingMatrix(): {
        matrix: Record<string, Record<string, number>>;
        locations: string[];
    };
    checkRoute(pickupLocation: string, dropoffLocation: string): {
        available: boolean;
        pickupLocation: string;
        dropoffLocation: string;
    };
}
