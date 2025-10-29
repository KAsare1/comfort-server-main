import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ResetSeatsDto } from './dto/reset-seats.dto';
import { VehiclesService } from './vehicle.service';
import { VehicleStatus } from 'src/shared/enums';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: CreateVehicleDto): Promise<import("../../database/entities/vehicle.entity").Vehicle>;
    findAll(): Promise<import("../../database/entities/vehicle.entity").Vehicle[]>;
    findAvailable(): Promise<import("../../database/entities/vehicle.entity").Vehicle[]>;
    findUnassigned(): Promise<import("../../database/entities/vehicle.entity").Vehicle[]>;
    getExpiringDocuments(days?: string): Promise<import("../../database/entities/vehicle.entity").Vehicle[]>;
    getStats(): Promise<{
        totalVehicles: number;
        assignedCount: number;
        unassignedCount: number;
        statusCounts: any[];
    }>;
    findWithPagination(queryDto: VehicleQueryDto): Promise<{
        data: import("../../database/entities/vehicle.entity").Vehicle[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getVehiclesByMake(): Promise<{
        make: string;
        count: number;
    }[]>;
    getMaintenanceAlerts(): Promise<{
        expiringInsurance: import("../../database/entities/vehicle.entity").Vehicle[];
        expiringRoadworthiness: import("../../database/entities/vehicle.entity").Vehicle[];
        maintenanceRequired: import("../../database/entities/vehicle.entity").Vehicle[];
    }>;
    findByLicensePlate(licensePlate: string): Promise<import("../../database/entities/vehicle.entity").Vehicle | null>;
    findOne(id: string): Promise<import("../../database/entities/vehicle.entity").Vehicle>;
    update(id: string, updateVehicleDto: Partial<CreateVehicleDto>): Promise<import("../../database/entities/vehicle.entity").Vehicle>;
    updateStatus(id: string, body: {
        status: VehicleStatus;
    }): Promise<import("../../database/entities/vehicle.entity").Vehicle>;
    assignToDriver(id: string, body: {
        driverId: string;
    }): Promise<import("../../database/entities/vehicle.entity").Vehicle>;
    unassignFromDriver(id: string): Promise<import("../../database/entities/vehicle.entity").Vehicle>;
    remove(id: string): Promise<void>;
    resetSeats(id: string, body: ResetSeatsDto): Promise<import("../../database/entities/vehicle.entity").Vehicle>;
}
