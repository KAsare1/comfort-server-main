import { VehicleStatus } from 'src/shared/enums';
export declare class VehicleQueryDto {
    page?: number;
    limit?: number;
    status?: VehicleStatus;
    hasDriver?: boolean;
    search?: string;
    make?: string;
    year?: number;
}
