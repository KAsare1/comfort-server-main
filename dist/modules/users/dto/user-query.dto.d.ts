import { UserRole } from 'src/shared/enums';
export declare class UserQueryDto {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
}
