// Add these authentication methods to your existing DriversService
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriverLoginDto } from './dto/driver-login.dto';
import { Driver } from 'src/database/entities/driver.entity';
import { DriverStatus } from 'src/shared/enums';
import { DistanceCalculator } from 'src/common/utils/distance.calculator';
import { DriverQueryDto } from './dto/driver-query.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
    private jwtService: JwtService,
  ) {}

  // ==================== NEW AUTH METHODS ====================

  /**
   * Login driver and return JWT token
   */
  async login(loginDto: DriverLoginDto): Promise<{ driver: Partial<Driver>; accessToken: string }> {
    const driver = await this.driversRepository.findOne({
      where: { phone: loginDto.phone, isActive: true },
      relations: ['vehicle'],
    });

    if (!driver) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, driver.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    // Generate JWT token
    const accessToken = this.generateToken(driver);

    // Remove password from response
    const { password, ...driverWithoutPassword } = driver;

    return {
      driver: driverWithoutPassword,
      accessToken,
    };
  }

  /**
   * Generate JWT token for driver
   */
  private generateToken(driver: Driver): string {
    const payload = {
      sub: driver.id,
      phone: driver.phone,
      name: driver.name,
      role: 'driver',
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Change driver password (can be used by driver or admin)
   */
  async changePassword(
    driverId: string,
    newPassword: string,
  ): Promise<void> {
    const driver = await this.driversRepository.findOne({
      where: { id: driverId, isActive: true },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.driversRepository.update(driverId, { password: hashedPassword });
  }

  /**
   * Update driver password (requires current password verification)
   */
  async updatePassword(
    driverId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const driver = await this.driversRepository.findOne({
      where: { id: driverId, isActive: true },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, driver.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.driversRepository.update(driverId, { password: hashedPassword });
  }

  /**
   * Get driver profile by ID (without password)
   */
  async getProfile(driverId: string): Promise<Partial<Driver>> {
    const driver = await this.findById(driverId);
    const { password, ...driverWithoutPassword } = driver;
    return driverWithoutPassword;
  }

  /**
   * Generate a random password for new drivers
   */
  generateRandomPassword(length: number = 8): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  // ==================== UPDATED CREATE METHOD ====================

  async create(createDriverDto: CreateDriverDto): Promise<{ driver: Partial<Driver>; password: string }> {
    // Check if driver already exists
    const existingDriver = await this.findByPhone(createDriverDto.phone);
    if (existingDriver) {
      throw new ConflictException(
        'Driver with this phone number already exists',
      );
    }

    // Generate random password
    const plainPassword = this.generateRandomPassword();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Create driver with hashed password
    const driver = this.driversRepository.create({
      ...createDriverDto,
      password: hashedPassword,
    });

    const savedDriver = await this.driversRepository.save(driver);

    // Remove password from response
    const { password, ...driverWithoutPassword } = savedDriver;

    return {
      driver: driverWithoutPassword,
      password: plainPassword, // Return plain password so admin can share it with driver
    };
  }

  // ==================== EXISTING METHODS (UNCHANGED) ====================

  async findAll(): Promise<Driver[]> {
    return this.driversRepository.find({
      where: { isActive: true },
      relations: ['vehicle', 'bookings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Driver> {
    const driver = await this.driversRepository.findOne({
      where: { id, isActive: true },
      relations: ['vehicle', 'bookings', 'trackingData'],
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async findByPhone(phone: string): Promise<Driver | null> {
    return this.driversRepository.findOne({
      where: { phone, isActive: true },
      relations: ['vehicle'],
    });
  }

  async findAvailableDrivers(): Promise<Driver[]> {
    return this.driversRepository.find({
      where: {
        status: DriverStatus.AVAILABLE,
        isActive: true,
      },
      relations: ['vehicle'],
    });
  }

  async findNearbyDrivers(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
  ): Promise<Array<Driver & { distance: number }>> {
    const availableDrivers = await this.findAvailableDrivers();

    const driversWithLocation = availableDrivers.filter(
      (driver) => driver.currentLatitude && driver.currentLongitude,
    );

    return DistanceCalculator.findNearestDrivers(
      latitude,
      longitude,
      driversWithLocation.map((driver) => ({
        id: driver.id,
        currentLatitude: driver.currentLatitude,
        currentLongitude: driver.currentLongitude,
      })),
      radiusKm,
    )
      .filter((result) => typeof result.id === 'string')
      .map((result) => {
        const driver = driversWithLocation.find((d) => d.id === result.id);
        if (!driver) {
          throw new NotFoundException(`Driver with id ${result.id} not found`);
        }
        return { ...driver, distance: result.distance };
      });
  }

  async updateLocation(
    id: string,
    locationDto: UpdateDriverLocationDto,
  ): Promise<Driver> {
    const driver = await this.findById(id);

    await this.driversRepository.update(id, {
      currentLatitude: locationDto.latitude,
      currentLongitude: locationDto.longitude,
      lastLocationUpdate: new Date(),
    });

    return this.findById(id);
  }

  async updateStatus(id: string, status: DriverStatus): Promise<Driver> {
    const driver = await this.findById(id);

    await this.driversRepository.update(id, { status });
    return this.findById(id);
  }

  async assignToBooking(driverId: string, bookingId: string): Promise<Driver> {
    const driver = await this.findById(driverId);

    if (driver.status !== DriverStatus.AVAILABLE) {
      throw new BadRequestException('Driver is not available');
    }

    return driver;
  }

  async completeTrip(driverId: string): Promise<Driver> {
    const driver = await this.findById(driverId);

    await this.driversRepository.update(driverId, {
      totalTrips: driver.totalTrips + 1,
      status: DriverStatus.AVAILABLE,
    });

    return this.findById(driverId);
  }

  async updateRating(driverId: string, newRating: number): Promise<Driver> {
    const driver = await this.findById(driverId);

    const updatedRating =
      (driver.rating * driver.totalTrips + newRating) / (driver.totalTrips + 1);

    await this.driversRepository.update(driverId, {
      rating: Math.round(updatedRating * 100) / 100,
    });

    return this.findById(driverId);
  }

  async getDriverStats(driverId: string) {
    const driver = await this.findById(driverId);

    const bookingStats = await this.driversRepository
      .createQueryBuilder('driver')
      .leftJoin('driver.bookings', 'booking')
      .select([
        'COUNT(booking.id) as totalBookings',
        "COUNT(CASE WHEN booking.status = 'completed' THEN 1 END) as completedBookings",
        "COUNT(CASE WHEN booking.status = 'cancelled' THEN 1 END) as cancelledBookings",
        'AVG(booking.totalAmount) as averageEarnings',
        "SUM(CASE WHEN booking.status = 'completed' THEN booking.totalAmount ELSE 0 END) as totalEarnings",
      ])
      .where('driver.id = :driverId', { driverId })
      .getRawOne();

    return {
      driver: {
        id: driver.id,
        name: driver.name,
        rating: driver.rating,
        totalTrips: driver.totalTrips,
        status: driver.status,
        vehicle: driver.vehicle,
      },
      stats: {
        totalBookings: parseInt(bookingStats.totalBookings) || 0,
        completedBookings: parseInt(bookingStats.completedBookings) || 0,
        cancelledBookings: parseInt(bookingStats.cancelledBookings) || 0,
        averageEarnings: parseFloat(bookingStats.averageEarnings) || 0,
        totalEarnings: parseFloat(bookingStats.totalEarnings) || 0,
        completionRate:
          bookingStats.totalBookings > 0
            ? (bookingStats.completedBookings / bookingStats.totalBookings) * 100
            : 0,
      },
    };
  }

  async deactivate(id: string): Promise<void> {
    await this.driversRepository.update(id, {
      isActive: false,
      status: DriverStatus.OFFLINE,
    });
  }

  async findWithPagination(queryDto: DriverQueryDto) {
    const { page = 1, limit = 10, status, hasVehicle, search } = queryDto;

    const query = this.driversRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.vehicle', 'vehicle')
      .where('driver.isActive = :isActive', { isActive: true });

    if (status) {
      query.andWhere('driver.status = :status', { status });
    }

    if (hasVehicle !== undefined) {
      if (hasVehicle) {
        query.andWhere('vehicle.id IS NOT NULL');
      } else {
        query.andWhere('vehicle.id IS NULL');
      }
    }

    if (search) {
      query.andWhere(
        '(driver.name ILIKE :search OR driver.phone ILIKE :search OR driver.email ILIKE :search OR driver.licenseNumber ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await query.getCount();
    const drivers = await query
      .orderBy('driver.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: drivers,
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

  async getOverallDriverStats() {
    const totalDrivers = await this.driversRepository.count({
      where: { isActive: true },
    });

    const statusCounts = await this.driversRepository
      .createQueryBuilder('driver')
      .select('driver.status, COUNT(driver.id) as count')
      .where('driver.isActive = :isActive', { isActive: true })
      .groupBy('driver.status')
      .getRawMany();

    const averageRating = await this.driversRepository
      .createQueryBuilder('driver')
      .select('AVG(driver.rating)', 'average')
      .where('driver.isActive = :isActive', { isActive: true })
      .getRawOne();

    const topDrivers = await this.driversRepository.find({
      where: { isActive: true },
      order: { rating: 'DESC', totalTrips: 'DESC' },
      take: 5,
      relations: ['vehicle'],
    });

    return {
      totalDrivers,
      statusCounts,
      averageRating: parseFloat(averageRating?.average || '0'),
      topDrivers,
    };
  }

  async getExpiringLicenses(daysAhead: number = 30): Promise<Driver[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.driversRepository.find({
      where: {
        isActive: true,
      },
      relations: ['vehicle'],
      order: { licenseExpiry: 'ASC' },
    });
  }

  async updateDocuments(
    id: string,
    documents: Record<string, string>,
  ): Promise<Driver> {
    const driver = await this.findById(id);

    const updatedDocuments = {
      ...driver.documents,
      ...documents,
    };

    await this.driversRepository.update(id, { documents: updatedDocuments });
    return this.findById(id);
  }

  async deactivateAll(): Promise<void> {
    await this.driversRepository.update(
      { isActive: true },
      {
        isActive: false,
        status: DriverStatus.OFFLINE,
      },
    );
  }
}