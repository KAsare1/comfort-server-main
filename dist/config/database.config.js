"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.getDatabaseConfig = void 0;
const typeorm_1 = require("typeorm");
const getDatabaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') === 'development',
    dropSchema: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('NODE_ENV') === 'production' ||
        configService.get('DB_SSL') === 'true'
        ? { rejectUnauthorized: false }
        : false,
    extra: {
        ssl: configService.get('NODE_ENV') === 'production' ||
            configService.get('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
    },
});
exports.getDatabaseConfig = getDatabaseConfig;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'comfort_user',
    password: process.env.DB_PASSWORD || 'comfort_password',
    database: process.env.DB_DATABASE || 'comfort_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    ssl: process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
    extra: {
        ssl: process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false,
    },
});
//# sourceMappingURL=database.config.js.map