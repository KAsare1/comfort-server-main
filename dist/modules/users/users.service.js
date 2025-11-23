"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../database/entities/user.entity");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.findByPhone(createUserDto.phone);
        if (existingUser) {
            throw new common_1.ConflictException('User with this phone number already exists');
        }
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }
    async findAll() {
        return this.usersRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findWithPagination(queryDto) {
        const { page = 1, limit = 10, role, search } = queryDto;
        const query = this.usersRepository
            .createQueryBuilder('user')
            .where('user.isActive = :isActive', { isActive: true });
        if (role)
            query.andWhere('user.role = :role', { role });
        if (search)
            query.andWhere('(user.name ILIKE :search OR user.phone ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
        const total = await query.getCount();
        const users = await query
            .orderBy('user.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    async getUserStats() {
        const totalUsers = await this.usersRepository.count({
            where: { isActive: true },
        });
        const roleCounts = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.role, COUNT(user.id) as count')
            .where('user.isActive = :isActive', { isActive: true })
            .groupBy('user.role')
            .getRawMany();
        const recentUsers = await this.usersRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        return {
            totalUsers,
            roleCounts,
            recentUsers,
        };
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email, isActive: true },
        });
    }
    async searchUsers(query, limit = 10) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.isActive = :isActive', { isActive: true })
            .andWhere('(user.name ILIKE :query OR user.phone ILIKE :query OR user.email ILIKE :query)', { query: `%${query}%` })
            .orderBy('user.name', 'ASC')
            .take(limit)
            .getMany();
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({
            where: { id, isActive: true },
            relations: ['bookings'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByPhone(phone) {
        return this.usersRepository.findOne({
            where: { phone, isActive: true },
        });
    }
    async findOrCreate(createUserDto) {
        const existingUser = await this.findByPhone(createUserDto.phone);
        if (existingUser) {
            return existingUser;
        }
        return this.create(createUserDto);
    }
    async update(id, updateData) {
        await this.usersRepository.update(id, updateData);
        return this.findById(id);
    }
    async deactivate(id) {
        await this.usersRepository.update(id, { isActive: false });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map