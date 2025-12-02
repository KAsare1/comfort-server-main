import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findWithPagination(queryDto: import('./dto/user-query.dto').UserQueryDto): Promise<{
        data: User[];
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
        recentUsers: User[];
    }>;
    findByEmail(email: string): Promise<User | null>;
    searchUsers(query: string, limit?: number): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByPhone(phone: string): Promise<User | null>;
    findOrCreate(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateData: Partial<CreateUserDto>): Promise<User>;
    deactivate(id: string): Promise<void>;
}
