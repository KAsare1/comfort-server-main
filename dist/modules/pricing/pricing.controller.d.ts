import { PricingService } from './pricing.service';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { TripType } from 'src/shared/enums';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    calculatePrice(calculateDto: CalculatePriceDto): Promise<{
        totalAmount: number;
        dailyRate: number;
        breakdown: {
            basePrice: number;
            distancePrice: number;
            timePrice: number;
            peakMultiplier: number;
            isPeakHour: boolean;
            distance: number;
            estimatedDuration: number | undefined;
            numberOfDays: number;
        };
    }>;
    getEstimatedFare(pickupLat: string, pickupLng: string, dropoffLat: string, dropoffLng: string, tripType?: TripType): Promise<{
        estimatedFare: number;
        distance: number;
        priceRange: {
            min: number;
            max: number;
        };
    }>;
    getPricingConstants(): {
        BASE_PRICE: number;
        ROUND_TRIP_MULTIPLIER: number;
        PEAK_HOUR_MULTIPLIER: number;
        DISTANCE_RATE_PER_KM: number;
        TIME_RATE_PER_MINUTE: number;
        MINIMUM_FARE: number;
        MAXIMUM_FARE: number;
        CANCELLATION_FEE: number;
        PEAK_HOURS: {
            start: string;
            end: string;
        }[];
        SERVICE_AREAS: string[];
    };
    updatePricingConstants(updates: any): Promise<{
        BASE_PRICE: number;
        ROUND_TRIP_MULTIPLIER: number;
        PEAK_HOUR_MULTIPLIER: number;
        DISTANCE_RATE_PER_KM: number;
        TIME_RATE_PER_MINUTE: number;
        MINIMUM_FARE: number;
        MAXIMUM_FARE: number;
        CANCELLATION_FEE: number;
        PEAK_HOURS: {
            start: string;
            end: string;
        }[];
        SERVICE_AREAS: string[];
    }>;
}
