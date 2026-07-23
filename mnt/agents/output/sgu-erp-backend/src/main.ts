import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import helmet from 'helmet';
import * as compression from 'compression';
import * as hpp from 'hpp';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerService } from './common/services/logger.service';

async function bootstrap() {
  const logger = new LoggerService('Bootstrap');
  
  // Fastify for better performance (handles 100k+ concurrent users)
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const env = configService.get<string>('NODE_ENV', 'development');

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:", "wss:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Compression
  app.use(compression());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: env === 'production',
  }));

  // Global Interceptors & Filters
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // WebSocket Adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger Documentation (only in dev/staging)
  if (env !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('SGU ERP API')
      .setDescription('Al-Salihiyah New University ERP System')
      .setVersion('3.8.0')
      .setContact('Engineer Youssef Khaled', '', 'youssef@sgu.edu.eg')
      .setLicense('Proprietary', '')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'api-key')
      .addTag('Auth', 'Authentication & Authorization')
      .addTag('Students', 'Student Management')
      .addTag('Professors', 'Faculty Management')
      .addTag('Courses', 'Course Management')
      .addTag('Grades', 'Grade Management')
      .addTag('Attendance', 'Attendance Tracking')
      .addTag('Finance', 'Financial Management')
      .addTag('Library', 'Library System')
      .addTag('AI', 'AI Assistant')
      .addTag('Notifications', 'Notification Center')
      .addTag('Integrations', 'External Integrations')
      .build();
    
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
      },
    });
  }

  // Graceful Shutdown
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 SGU ERP Server running on port ${port} in ${env} mode`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`🔒 Security: Helmet + Rate Limiting + CORS enabled`);
}

bootstrap();
