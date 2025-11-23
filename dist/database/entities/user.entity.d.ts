import { Booking } from './booking.entity';
import { UserRole } from 'src/shared/enums';
export declare class User {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: UserRole;
    password: string;
    isActive: boolean;
    preferences: Record<string, any>;
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
