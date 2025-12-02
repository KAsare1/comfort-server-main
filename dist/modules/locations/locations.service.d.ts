import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateLocationDto } from './dto/create-location.dto';
import { GeocodeDto } from './dto/geocode.dto';
import { RouteInfo } from 'src/common/interfaces/tracking.interface';
import { Location } from 'src/database/entities/location.entity';
export declare class LocationsService {
    private locationsRepository;
    private configService;
    private mapboxClient;
    private mapboxConfig;
    constructor(locationsRepository: Repository<Location>, configService: ConfigService);
    create(createLocationDto: CreateLocationDto): Promise<Location>;
    findAll(): Promise<Location[]>;
    findPopular(): Promise<Location[]>;
    findById(id: string): Promise<Location>;
    searchLocations(query: string, limit?: number): Promise<Location[]>;
    findNearby(latitude: number, longitude: number, radiusKm?: number): Promise<Array<Location & {
        distance: number;
    }>>;
    geocodeForward(geocodeDto: GeocodeDto): Promise<any[]>;
    geocodeReverse(latitude: number, longitude: number): Promise<any>;
    getRoute(start: [number, number], end: [number, number], profile?: string): Promise<RouteInfo>;
    getOptimizedRoute(start: [number, number], waypoints: [number, number][], end: [number, number]): Promise<any>;
    addPopularLocation(name: string, address: string, coordinates: [number, number]): Promise<Location>;
    updateLocation(id: string, updateData: Partial<CreateLocationDto>): Promise<Location>;
    deactivateLocation(id: string): Promise<void>;
    getLocationStats(): Promise<{
        totalLocations: number;
        popularLocations: number;
        locationsByCity: any[];
    }>;
}
