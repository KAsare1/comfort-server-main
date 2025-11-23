"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../shared/enums");
let PricingService = class PricingService {
    pricingMatrix = {
        Abuakwa: {
            Adum: 10,
            Kejetia: 9,
            Sofoline: 7,
            Kwadaso: 7,
            Asuoyeboah: 6,
            Tanoso: 6,
        },
        Tanoso: {
            Adum: 8,
            Kejetia: 7,
            Sofoline: 6,
            Kwadaso: 5,
            Asuoyeboah: 5,
        },
        Asuoyeboah: {
            Adum: 6,
            Kejetia: 5,
            Kwadaso: 5,
            Sofoline: 5,
        },
        Kwadaso: {
            Adum: 6,
            Kejetia: 5,
            Sofoline: 5,
        },
    };
    locations = [
        'Sofoline',
        'Kwadaso',
        'Asuoyeboah',
        'Tanoso',
        'Abuakwa',
        'Adum',
        'Kejetia',
    ];
    getBaseFare(pickupLocation, dropoffLocation) {
        if (!pickupLocation || !dropoffLocation) {
            throw new common_1.BadRequestException('Pickup and dropoff locations are required');
        }
        if (pickupLocation === dropoffLocation) {
            throw new common_1.BadRequestException('Pickup and dropoff locations cannot be the same');
        }
        let fare = this.pricingMatrix[pickupLocation]?.[dropoffLocation];
        if (!fare) {
            fare = this.pricingMatrix[dropoffLocation]?.[pickupLocation];
        }
        if (!fare) {
            throw new common_1.BadRequestException(`Route not available between ${pickupLocation} and ${dropoffLocation}`);
        }
        return fare;
    }
    calculateFare(pickupLocation, dropoffLocation, tripType) {
        const baseFare = this.getBaseFare(pickupLocation, dropoffLocation);
        const multiplier = tripType === enums_1.TripType.ROUND_TRIP ? 2 : 1;
        return baseFare * multiplier;
    }
    getFareEstimate(pickupLocation, dropoffLocation, tripType) {
        const baseFare = this.getBaseFare(pickupLocation, dropoffLocation);
        const multiplier = tripType === enums_1.TripType.ROUND_TRIP ? 2 : 1;
        const totalFare = baseFare * multiplier;
        return {
            fare: totalFare,
            baseFare,
            tripType,
            multiplier,
            breakdown: {
                oneWayFare: baseFare,
                roundTripMultiplier: tripType === enums_1.TripType.ROUND_TRIP ? 2 : 1,
                totalFare,
            },
        };
    }
    getAvailableLocations() {
        return this.locations;
    }
    getAllRoutes() {
        const routes = [];
        for (const [from, destinations] of Object.entries(this.pricingMatrix)) {
            for (const [to, fare] of Object.entries(destinations)) {
                routes.push({ from, to, fare });
            }
        }
        return routes;
    }
    isRouteAvailable(pickupLocation, dropoffLocation) {
        if (pickupLocation === dropoffLocation)
            return false;
        const hasDirect = !!this.pricingMatrix[pickupLocation]?.[dropoffLocation];
        const hasReverse = !!this.pricingMatrix[dropoffLocation]?.[pickupLocation];
        return hasDirect || hasReverse;
    }
    getPricingMatrix() {
        return {
            matrix: this.pricingMatrix,
            locations: this.locations,
        };
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)()
], PricingService);
//# sourceMappingURL=pricing.service.js.map