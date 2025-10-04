"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConfig = void 0;
const getRedisConfig = (configService) => ({
    host: configService.get('REDIS_HOST', 'localhost'),
    port: configService.get('REDIS_PORT', 6379),
    password: configService.get('REDIS_PASSWORD'),
    retryAttempts: 3,
    retryDelay: 1000,
});
exports.getRedisConfig = getRedisConfig;
//# sourceMappingURL=redis.config.js.map