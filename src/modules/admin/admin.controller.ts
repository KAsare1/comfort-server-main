import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminStatsDto } from './dto/admin-stats.dto';
import { DriverAssignmentDto } from './dto/driver-assignment.dto';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { Roles } from '@/common/decorators/roles.decorator';
// import { UserRole } from '@/shared/enums';

@Controller('admin')
// @UseGuards(RolesGuard)
// @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats(@Query() adminStatsDto: AdminStatsDto) {
    return this.adminService.getDashboardStats(adminStatsDto);
  }

  @Post('assign-driver')
  assignDriver(@Body() assignmentDto: DriverAssignmentDto) {
    return this.adminService.assignDriver(assignmentDto);
  }

  @Get('system-health')
  getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('revenue-trends')
  getRevenueTrends(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 30;
    return this.adminService.getRevenueTrends(daysNum);
  }
}