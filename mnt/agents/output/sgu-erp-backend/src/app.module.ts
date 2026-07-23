import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { ProfessorsModule } from './professors/professors.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { GradesModule } from './grades/grades.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ExamsModule } from './exams/exams.module';
import { FinanceModule } from './finance/finance.module';
import { LibraryModule } from './library/library.module';
import { HrModule } from './hr/hr.module';
import { DormsModule } from './dorms/dorms.module';
import { TransportModule } from './transport/transport.module';
import { ClinicModule } from './clinic/clinic.module';
import { SecurityModule } from './security/security.module';
import { AlumniModule } from './alumni/alumni.module';
import { ParentsModule } from './parents/parents.module';
import { AiModule } from './ai/ai.module';
import { NotificationsModule } from './notifications/notifications.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { AuditModule } from './audit/audit.module';
import { ReportsModule } from './reports/reports.module';

import { LoggerService } from './common/services/logger.service';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import securityConfig from './config/security.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, securityConfig],
      envFilePath: ['.env.production', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'sgu_admin'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', 'sgu_erp'),
        schema: config.get('DB_SCHEMA', 'public'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') === 'development',
        logging: config.get('NODE_ENV') === 'development',
        maxQueryExecutionTime: 1000,
        poolSize: 50,
        extra: {
          max: 50,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
        ssl: config.get('DB_SSL') === 'true' ? {
          rejectUnauthorized: false,
        } : false,
      }),
      inject: [ConfigService],
    }),

    // Redis & Bull Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
          db: config.get<number>('REDIS_DB', 0),
          maxRetriesPerRequest: 3,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting - 100 req/min for normal users, 1000 req/min for premium
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          ttl: 60000,
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        },
        {
          name: 'auth',
          ttl: 60000,
          limit: 10,
        },
        {
          name: 'premium',
          ttl: 60000,
          limit: 1000,
        },
      ],
      inject: [ConfigService],
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Event Emitter
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 20,
    }),

    // Winston Logger
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transports: LoggerService.createTransports(config),
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    StudentsModule,
    ProfessorsModule,
    CoursesModule,
    EnrollmentsModule,
    GradesModule,
    AttendanceModule,
    ExamsModule,
    FinanceModule,
    LibraryModule,
    HrModule,
    DormsModule,
    TransportModule,
    ClinicModule,
    SecurityModule,
    AlumniModule,
    ParentsModule,
    AiModule,
    NotificationsModule,
    IntegrationsModule,
    AuditModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggingMiddleware)
      .forRoutes('*');
  }
}
