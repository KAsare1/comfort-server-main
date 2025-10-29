// src/modules/admin/dto/admin-stats.dto.ts
import { IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum StatsTimeRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export class AdminStatsDto {
  @IsEnum(StatsTimeRange)
  @IsOptional()
  range?: StatsTimeRange = StatsTimeRange.TODAY;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
