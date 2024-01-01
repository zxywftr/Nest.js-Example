import {
  BeforeApplicationShutdown,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfiguration from './common/config/database.configuration';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './photo/photo.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MulterModule } from '@nestjs/platform-express';
import { defaultMulterOptions } from './common/utils/diskStorage';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    /**
     * Application level configuration
     * @see https://docs.nestjs.com/techniques/configuration
     */
    ConfigModule.forRoot({
      // To increase the performance of `ConfigService#get` method when it comes to variables stored in process.env.
      cache: true,
      // If a variable is found in multiple files, the first one takes precedence.
      envFilePath: ['.env', '.env.local'],
      // In this case, you will not need to import ConfigModule in other modules
      isGlobal: true,
      /*
      A custom configuration file exports a factory function that returns a configuration object.
       The configuration object can be any arbitrarily nested plain JavaScript object. 
       The process.env object will contain the fully resolved environment variable key/value pairs 
       (with .env file and externally defined variables resolved and merged as described above)
      */
      load: [databaseConfiguration],
    }),

    /**
     * Database: Associating Mysql with TypeOrm
     * @see https://docs.nestjs.com/techniques/database
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DATABASE_TYPE'),
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PWD'),
        database: configService.get<string>('DATABASE_REPO'),
        entityPrefix: configService.get<string>('DATABASE_PREFIX'),
        /*
         * Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
         * @see https://juejin.cn/post/7118568111850127368；只要改列的名称或者属性都会导致该列被删除重新创建，所以该列的数据也会丢失
         */
        synchronize: true,
        /**
         * Default cache lifetime is equal to 1000 ms
         * When you enable cache for the first time, you must synchronize your database schema (using CLI, migrations or the synchronize data source option).
         */
        cache: true,
        /**
         * Automatically load entities which are registered by the `TypeOrmModule.forFeature()` method.
         * By this feature, we prevent from leaking implementation details to other parts of the application.
         */
        autoLoadEntities: true,
      }),
    }),

    /**
     * Global Caching
     * @see https://docs.nestjs.com/techniques/caching
     */
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // With this option set to `true`, there is no need for you to put this moudle in the consumer module's `imports` array.
        isGlobal: true,
        // Note: cache-manager version 4 uses seconds for TTL (Time-To-Live). The current version of cache-manager (v5) has switched to using milliseconds instead. NestJS doesn't convert the value, and simply forwards the ttl you provide to the library.
        ttl: +configService.get<number>('CACHE_TTL'),
      }),
    }),

    /**
     * Global multer module.
     * @see https://docs.nestjs.com/techniques/file-upload
     */
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: defaultMulterOptions(
          configService.get<string>('FILE_UPLOAD_STORAGE_PATH'),
        ),
        limits: {
          fieldNameSize: 50,
          headerPairs: 100,
        },
      }),
    }),

    /**
     * Protect application from blute-force attacks.
     * @see https://docs.nestjs.com/security/rate-limiting
     */
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL'),
          limit: configService.get<number>('THROTTLE_LIMIT'),
        },
      ],
    }),

    // Authorization & Authentication
    AuthModule,
    
    /**
     * Demonstrating dynamic module.
     * @see https://docs.nestjs.com/fundamentals/dynamic-modules
     */
    UsersModule.register({
      comment: 'dynamic option',
    }),
    PhotoModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    // global guards with dependency injection
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule
  implements
    NestModule,
    OnModuleInit,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationBootstrap,
    OnApplicationShutdown
{
  /**
   * Demonstrate middle usage.
   * @see https://docs.nestjs.com/middleware
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude('catsTest/(.*)', { path: 'cats', method: RequestMethod.POST })
      .forRoutes(
        UsersController,
        { path: 'ab*cd', method: RequestMethod.ALL },
        { path: 'cats', method: RequestMethod.GET },
      );
  }

  /**
   * Lifecycle events
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events
   */
  onModuleInit() {
    console.log('onModuleInit');
  }
  onModuleDestroy() {
    console.log('onModuleDestroy');
  }
  onApplicationBootstrap() {
    console.log('onApplicationBootstrap');
  }
  beforeApplicationShutdown(signal?: string) {
    console.log('beforeApplicationShutdown', signal);
  }
  onApplicationShutdown(signal?: string) {
    console.log('onApplicationShutdown', signal);
  }
}
