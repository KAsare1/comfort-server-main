import { VehicleStatus } from 'src/shared/enums';
export declare class UpdateVehicleDto {
    licensePlate?: string;
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    capacity?: number;
    totalSeats?: number;
    seatsAvailable?: number;
    status?: VehicleStatus;
    vin?: string;
    insuranceExpiry?: string;
    roadworthinessExpiry?: string;
    features?: string[];
}
