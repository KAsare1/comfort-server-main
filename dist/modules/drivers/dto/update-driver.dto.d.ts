import { DriverStatus } from 'src/shared/enums';
export declare class UpdateDriverDto {
    name?: string;
    phone?: string;
    email?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
    status?: DriverStatus;
    isActive?: boolean;
    documents?: Record<string, string>;
}
