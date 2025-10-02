import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'module-alias/register';


declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
    const config = new DocumentBuilder()
    .setTitle('Comfort Backend API')
    .setDescription('The Comfort Backend')
    .setVersion('1.0')
    .addTag('comfort')
    .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);


  // WebSocket adapter for real-time tracking
  app.useWebSocketAdapter(new IoAdapter(app));

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  
  console.log(`🚗 COMFORT Backend running on port ${port}`);
  console.log(`📍 API available at: http://localhost:${port}/${configService.get('API_PREFIX', 'api/v1')}`);

    if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();