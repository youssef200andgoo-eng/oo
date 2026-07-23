import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set Global API Prefix
  app.setGlobalPrefix('api');

  // Enable API Versioning (/api/v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Security and Utility Middlewares
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, X-Request-ID',
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Global Exception Filters
  // Note: AllExceptionsFilter should come first as a catch-all, and HttpExceptionFilter handles specialized HTTP errors.
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('SGU University ERP API')
    .setDescription('Production-ready backend API specifications for SGU University ERP system.')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT access token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Bind and listen
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, '0.0.0.0');
  console.log(`[SGU ERP] Backend is listening on port ${PORT}`);
  console.log(`[SGU ERP] Swagger documentation available at http://localhost:${PORT}/api/docs`);
}

bootstrap();
