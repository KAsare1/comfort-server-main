"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Comfort Backend API')
        .setDescription('The Comfort Backend')
        .setVersion('1.0')
        .addTag('comfort')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, documentFactory);
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    const port = configService.get('PORT', 3001);
    await app.listen(port);
    console.log(`🚗 COMFORT Backend running on port ${port}`);
    console.log(`📍 API available at: http://localhost:${port}/${configService.get('API_PREFIX', 'api/v1')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map