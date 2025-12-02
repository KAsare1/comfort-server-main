import { Vehicle } from 'src/database/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleStatus } from 'src/shared/enums';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
export declare class VehiclesService {
    private vehiclesRepository;
    constructor(vehiclesRepository: Repository<Vehicle>);
    create(createVehicleDto: CreateVehicleDto): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findById(id: string): Promise<Vehicle>;
    findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
    findAvailableVehicles(): Promise<Vehicle[]>;
    findUnassignedVehicles(): Promise<Vehicle[]>;
    assignToDriver(vehicleId: string, driverId: string): Promise<Vehicle>;
    unassignFromDriver(vehicleId: string): Promise<Vehicle>;
    updateStatus(id: string, status: VehicleStatus): Promise<Vehicle>;
    update(id: string, updateData: Partial<CreateVehicleDto>): Promise<Vehicle>;
    getExpiringDocuments(daysAhead?: number): Promise<Vehicle[]>;
    getVehicleStats(): Promise<{
        totalVehicles: number;
        assignedCount: number;
        unassignedCount: number;
        statusCounts: any[];
    }>;
    delete(id: string): Promise<void>;
    findWithPagination(queryDto: VehicleQueryDto): Promise<{
        data: Vehicle[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getVehiclesByMake(): Promise<Array<{
        make: string;
        count: number;
    }>>;
    resetSeats(id: string, seats?: number): Promise<Vehicle>;
    getMaintenanceAlerts(): Promise<{
        expiringInsurance: Vehicle[];
        expiringRoadworthiness: Vehicle[];
        maintenanceRequired: Vehicle[];
    }>;
}
