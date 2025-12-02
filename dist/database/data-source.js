"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'comfort_user',
    password: process.env.DB_PASSWORD || 'comfort_password',
    database: process.env.DB_DATABASE || 'comfort_db',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    ssl: process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
});
//# sourceMappingURL=data-source.js.map