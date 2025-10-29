// src/database/data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'comfort_user',
  password: process.env.DB_PASSWORD || 'comfort_password',
  database: process.env.DB_DATABASE || 'comfort_db',

  // Entity paths
  entities: ['src/**/*.entity.ts'],

  // Migration paths
  migrations: ['src/database/migrations/*.ts'],

  // SSL config
  ssl:
    process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false,
});
