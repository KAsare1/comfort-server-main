import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByPhone(createUserDto.phone);
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findWithPagination(
    queryDto: import('./dto/user-query.dto').UserQueryDto,
  ) {
    const { page = 1, limit = 10, role, search } = queryDto;
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true });
    if (role) query.andWhere('user.role = :role', { role });
    if (search)
      query.andWhere(
        '(user.name ILIKE :search OR user.phone ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
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

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, isActive: true },
    });
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere(
        '(user.name ILIKE :query OR user.phone ILIKE :query OR user.email ILIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('user.name', 'ASC')
      .take(limit)
      .getMany();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, isActive: true },
      relations: ['bookings'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { phone, isActive: true },
    });
  }

  async findOrCreate(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByPhone(createUserDto.phone);
    if (existingUser) {
      return existingUser;
    }
    return this.create(createUserDto);
  }

  async update(id: string, updateData: Partial<CreateUserDto>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async deactivate(id: string): Promise<void> {
    await this.usersRepository.update(id, { isActive: false });
  }
}
