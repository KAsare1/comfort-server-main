import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { GeocodeDto } from './dto/geocode.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(createLocationDto: CreateLocationDto): Promise<import("../../database/entities/location.entity").Location>;
    findAll(): Promise<import("../../database/entities/location.entity").Location[]>;
    findPopular(): Promise<import("../../database/entities/location.entity").Location[]>;
    searchLocations(query: string, limit?: string): Promise<import("../../database/entities/location.entity").Location[]>;
    findNearby(lat: string, lng: string, radius?: string): Promise<(import("../../database/entities/location.entity").Location & {
        distance: number;
    })[]>;
    geocodeForward(geocodeDto: GeocodeDto): Promise<any[]>;
    geocodeReverse(lat: string, lng: string): Promise<any>;
    getRoute(routeData: {
        start: [number, number];
        end: [number, number];
        profile?: string;
    }): Promise<import("../../common/interfaces/tracking.interface").RouteInfo>;
    getOptimizedRoute(routeData: {
        start: [number, number];
        waypoints: [number, number][];
        end: [number, number];
    }): Promise<any>;
    getStats(): Promise<{
        totalLocations: number;
        popularLocations: number;
        locationsByCity: any[];
    }>;
    findOne(id: string): Promise<import("../../database/entities/location.entity").Location>;
    update(id: string, updateLocationDto: Partial<CreateLocationDto>): Promise<import("../../database/entities/location.entity").Location>;
    remove(id: string): Promise<void>;
}
