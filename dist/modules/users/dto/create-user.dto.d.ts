import { UserRole } from 'src/shared/enums';
export declare class CreateUserDto {
    name: string;
    phone: string;
    email?: string;
    role?: UserRole;
    preferences?: Record<string, any>;
}
