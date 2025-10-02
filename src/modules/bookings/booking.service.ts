import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Booking } from 'src/database/entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Generators } from 'src/common/utils/generator';
import { BookingStatus } from 'src/shared/enums';
import { PricingService } from '../pricing/pricing.service';
import { LocationsService } from '../locations/locations.service';


@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private usersService: UsersService,
    private pricingService: PricingService,
    private locationsService: LocationsService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Find or create user
    const user = await this.usersService.findOrCreate({
      name: createBookingDto.name,
      phone: createBookingDto.phone,
    });

    // Calculate pricing
    const pricing = await this.pricingService.calculateBookingPrice({
      pickupLatitude: createBookingDto.pickupLatitude,
      pickupLongitude: createBookingDto.pickupLongitude,
      dropoffLatitude: createBookingDto.dropoffLatitude,
      dropoffLongitude: createBookingDto.dropoffLongitude,
      tripType: createBookingDto.tripType,
      bookingDates: createBookingDto.bookingDates,
      pickupTime: createBookingDto.pickupTime,
    });

    // Get route information
    const route = await this.locationsService.getRoute(
      [createBookingDto.pickupLongitude, createBookingDto.pickupLatitude],
      [createBookingDto.dropoffLongitude, createBookingDto.dropoffLatitude],
    );

    // Create booking
    const booking = this.bookingsRepository.create({
      reference: Generators.generateBookingReference(),
      customerId: user.id,
      pickupLocation: createBookingDto.pickupLocation,
      pickupLatitude: createBookingDto.pickupLatitude,
      pickupLongitude: createBookingDto.pickupLongitude,
      dropoffLocation: createBookingDto.dropoffLocation,
      dropoffLatitude: createBookingDto.dropoffLatitude,
      dropoffLongitude: createBookingDto.dropoffLongitude,
      pickupTime: createBookingDto.pickupTime,
      dropoffTime: createBookingDto.dropoffTime,
      tripType: createBookingDto.tripType,
      bookingDates: createBookingDto.bookingDates,
      totalAmount: pricing.totalAmount,
      distance: route.distance,
      estimatedDuration: route.duration,
      route: route.geometry,
      notes: createBookingDto.notes,
      status: BookingStatus.PENDING,
    });

    return this.bookingsRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['customer', 'driver', 'driver.vehicle', 'payment', 'trackingData'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async findByReference(reference: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { reference },
      relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async findByCustomer(customerId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { customerId },
      relations: ['driver', 'driver.vehicle', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDriver(driverId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { driverId },
      relations: ['customer', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: BookingStatus, metadata?: Record<string, any>): Promise<Booking> {
    const booking = await this.findById(id);
    
    const updateData: Partial<Booking> = { status };
    
    // Update timestamps based on status
    switch (status) {
      case BookingStatus.ASSIGNED:
        updateData.assignedAt = new Date();
        if (metadata?.driverId) {
          updateData.driverId = metadata.driverId;
        }
        break;
      case BookingStatus.IN_PROGRESS:
        updateData.startedAt = new Date();
        break;
      case BookingStatus.COMPLETED:
        updateData.completedAt = new Date();
        break;
    }

    await this.bookingsRepository.update(id, updateData);
    return this.findById(id);
  }

  async assignDriver(bookingId: string, driverId: string): Promise<Booking> {
    return this.updateStatus(bookingId, BookingStatus.ASSIGNED, { driverId });
  }

  async cancel(id: string, reason?: string): Promise<Booking> {
    const booking = await this.findById(id);
    
    if ([BookingStatus.COMPLETED, BookingStatus.CANCELLED].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel this booking');
    }

    return this.updateStatus(id, BookingStatus.CANCELLED);
  }

  async getActiveBookings(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: [
        { status: BookingStatus.CONFIRMED },
        { status: BookingStatus.ASSIGNED },
        { status: BookingStatus.EN_ROUTE },
        { status: BookingStatus.ARRIVED },
        { status: BookingStatus.IN_PROGRESS },
      ],
      relations: ['customer', 'driver', 'driver.vehicle'],
      order: { createdAt: 'ASC' },
    });
  }

  async getBookingStats(startDate?: Date, endDate?: Date) {
    const query = this.bookingsRepository.createQueryBuilder('booking');
    if (startDate) {
      query.andWhere('booking.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('booking.createdAt <= :endDate', { endDate });
    }
    const totalBookings = await query.getCount();
    const statusCounts = await query
      .select('booking.status, COUNT(booking.id) as count')
      .groupBy('booking.status')
      .getRawMany();
    const totalRevenue = await query
      .select('SUM(booking.totalAmount)', 'total')
      .where('booking.status = :status', { status: BookingStatus.COMPLETED })
      .getRawOne();
    return {
      totalBookings,
      statusCounts,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
    };
  }

  async findWithPagination(queryDto: import('./dto/booking-query.dto').BookingQueryDto) {
    const { page = 1, limit = 10, status, tripType, customerId, driverId, startDate, endDate, search } = queryDto;
    const query = this.bookingsRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.driver', 'driver')
      .leftJoinAndSelect('driver.vehicle', 'vehicle')
      .leftJoinAndSelect('booking.payment', 'payment');
    if (status) query.andWhere('booking.status = :status', { status });
    if (tripType) query.andWhere('booking.tripType = :tripType', { tripType });
    if (customerId) query.andWhere('booking.customerId = :customerId', { customerId });
    if (driverId) query.andWhere('booking.driverId = :driverId', { driverId });
    if (startDate) query.andWhere('booking.createdAt >= :startDate', { startDate: new Date(startDate) });
    if (endDate) query.andWhere('booking.createdAt <= :endDate', { endDate: new Date(endDate) });
    if (search) query.andWhere(
      '(booking.reference ILIKE :search OR booking.pickupLocation ILIKE :search OR booking.dropoffLocation ILIKE :search OR customer.name ILIKE :search)',
      { search: `%${search}%` }
    );
    const total = await query.getCount();
    const bookings = await query
      .orderBy('booking.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const totalPages = Math.ceil(total / limit);
    return {
      data: bookings,
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

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { createdAt: Between(startDate, endDate) },
      relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUpcomingBookings(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: [
        { status: BookingStatus.CONFIRMED },
        { status: BookingStatus.ASSIGNED },
      ],
      relations: ['customer', 'driver', 'driver.vehicle'],
      order: { scheduledAt: 'ASC' },
    });
  }

  async getRecentBookings(limit: number = 10): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['customer', 'driver', 'driver.vehicle'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async updateBookingLocation(id: string, locationData: {
    pickupLocation?: string;
    pickupLatitude?: number;
    pickupLongitude?: number;
    dropoffLocation?: string;
    dropoffLatitude?: number;
    dropoffLongitude?: number;
  }): Promise<Booking> {
    const booking = await this.findById(id);
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Can only update location for pending bookings');
    }
    await this.bookingsRepository.update(id, locationData);
    return this.findById(id);
  }
}


