import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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

import { LoggerService } from './common/services/logger.service';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
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
      useFactory: (config: ConfigService) => {
        const dbHost = config.get('DB_HOST');
        const useSqlite = config.get('DB_TYPE') === 'sqlite' || !dbHost || dbHost === 'localhost' || dbHost === '127.0.0.1';

        if (useSqlite) {
          return {
            type: 'sqlite',
            database: 'sgu_erp.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: config.get('NODE_ENV') === 'development',
          } as TypeOrmModuleOptions;
        }

        return {
          type: 'postgres',
          host: dbHost,
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
        } as TypeOrmModuleOptions;
      },
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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
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
