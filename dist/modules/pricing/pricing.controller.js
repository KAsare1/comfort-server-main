"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pricing_service_1 = require("./pricing.service");
const calculate_price_dto_1 = require("./dto/calculate-price.dto");
let PricingController = class PricingController {
    pricingService;
    constructor(pricingService) {
        this.pricingService = pricingService;
    }
    calculateFare(calculateFareDto) {
        return this.pricingService.getFareEstimate(calculateFareDto.pickupLocation, calculateFareDto.dropoffLocation, calculateFareDto.tripType);
    }
    getEstimate(pickupLocation, dropoffLocation, tripType = 'one-way') {
        return this.pricingService.getFareEstimate(pickupLocation, dropoffLocation, tripType);
    }
    getLocations() {
        return {
            locations: this.pricingService.getAvailableLocations(),
        };
    }
    getAllRoutes() {
        return {
            routes: this.pricingService.getAllRoutes(),
        };
    }
    getPricingMatrix() {
        return this.pricingService.getPricingMatrix();
    }
    checkRoute(pickupLocation, dropoffLocation) {
        return {
            available: this.pricingService.isRouteAvailable(pickupLocation, dropoffLocation),
            pickupLocation,
            dropoffLocation,
        };
    }
};
exports.PricingController = PricingController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate fare for a route',
        description: 'Calculate the total fare based on pickup location, dropoff location, and trip type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fare calculated successfully',
        schema: {
            example: {
                fare: 10,
                baseFare: 5,
                tripType: 'round-trip',
                multiplier: 2,
                breakdown: {
                    oneWayFare: 5,
                    roundTripMultiplier: 2,
                    totalFare: 10,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input or route not available',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_price_dto_1.CalculatePriceDto]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "calculateFare", null);
__decorate([
    (0, common_1.Get)('estimate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get fare estimate using query parameters',
        description: 'Alternative endpoint to calculate fare using URL query parameters instead of POST body',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fare estimate retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid parameters or route not available',
    }),
    __param(0, (0, common_1.Query)('pickupLocation')),
    __param(1, (0, common_1.Query)('dropoffLocation')),
    __param(2, (0, common_1.Query)('tripType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "getEstimate", null);
__decorate([
    (0, common_1.Get)('locations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all available locations',
        description: 'Returns a list of all locations where bus service is available',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of available locations',
        schema: {
            example: {
                locations: [
                    'Sofoline',
                    'Kwadaso',
                    'Asuoyeboah',
                    'Tanoso',
                    'Abuakwa',
                    'Adum',
                    'Kejetia',
                ],
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Get)('routes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all available routes and their prices',
        description: 'Returns all available routes with their one-way fare prices',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all routes',
        schema: {
            example: {
                routes: [
                    { from: 'Abuakwa', to: 'Adum', fare: 10 },
                    { from: 'Abuakwa', to: 'Kejetia', fare: 9 },
                    { from: 'Tanoso', to: 'Adum', fare: 8 },
                ],
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "getAllRoutes", null);
__decorate([
    (0, common_1.Get)('matrix'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get the full pricing matrix',
        description: 'Returns the complete pricing matrix and list of locations (admin use)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Full pricing matrix',
        schema: {
            example: {
                matrix: {
                    Abuakwa: { Adum: 10, Kejetia: 9 },
                    Tanoso: { Adum: 8, Kejetia: 7 },
                },
                locations: [
                    'Sofoline',
                    'Kwadaso',
                    'Asuoyeboah',
                    'Tanoso',
                    'Abuakwa',
                    'Adum',
                    'Kejetia',
                ],
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "getPricingMatrix", null);
__decorate([
    (0, common_1.Get)('check-route'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if a route is available',
        description: 'Verify if a route exists between two locations without calculating the fare',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Route availability status',
        schema: {
            example: {
                available: true,
                pickupLocation: 'Sofoline',
                dropoffLocation: 'Adum',
            },
        },
    }),
    __param(0, (0, common_1.Query)('pickupLocation')),
    __param(1, (0, common_1.Query)('dropoffLocation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "checkRoute", null);
exports.PricingController = PricingController = __decorate([
    (0, swagger_1.ApiTags)('pricing'),
    (0, common_1.Controller)('pricing'),
    __metadata("design:paramtypes", [pricing_service_1.PricingService])
], PricingController);
//# sourceMappingURL=pricing.controller.js.map