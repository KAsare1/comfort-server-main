import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
export declare const getDatabaseConfig: (configService: ConfigService) => TypeOrmModuleOptions;
export declare const AppDataSource: DataSource;
