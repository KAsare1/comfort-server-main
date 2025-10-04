import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../../database/entities/user.entity").User>;
    findAll(): Promise<import("../../database/entities/user.entity").User[]>;
    findOne(id: string): Promise<import("../../database/entities/user.entity").User>;
    update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<import("../../database/entities/user.entity").User>;
    remove(id: string): Promise<void>;
    findWithPagination(queryDto: UserQueryDto): Promise<{
        data: import("../../database/entities/user.entity").User[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getUserStats(): Promise<{
        totalUsers: number;
        roleCounts: any[];
        recentUsers: import("../../database/entities/user.entity").User[];
    }>;
    searchUsers(query: string, limit?: string): Promise<import("../../database/entities/user.entity").User[]>;
    findByPhone(phone: string): Promise<import("../../database/entities/user.entity").User | null>;
    findByEmail(email: string): Promise<import("../../database/entities/user.entity").User | null>;
}
