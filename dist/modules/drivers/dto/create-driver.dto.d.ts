import { DriverStatus } from 'src/shared/enums';
export declare class CreateDriverDto {
    name: string;
    phone: string;
    email?: string;
    licenseNumber: string;
    licenseExpiry: string;
    status?: DriverStatus;
    documents?: Record<string, string>;
}
