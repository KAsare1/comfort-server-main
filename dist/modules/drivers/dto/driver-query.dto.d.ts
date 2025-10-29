import { DriverStatus } from 'src/shared/enums';
export declare class DriverQueryDto {
    page?: number;
    limit?: number;
    status?: DriverStatus;
    hasVehicle?: boolean;
    search?: string;
}
