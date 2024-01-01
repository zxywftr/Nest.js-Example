import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Enabling application's Cross-origin resource sharing (CORS) capability. @see https://docs.nestjs.com/security/cors
    cors: {
      origin:'*'
    },
  });

  /**
   * Helment
   * Note that applying helmet as global or registering it **must** come before other calls to app.use() or setup functions that may call app.use().
   * @see https://docs.nestjs.com/security/helmet
   */
  app.use(helmet());

  // get environment variables from application configuration
  const configService = app.get(ConfigService);

  /**
   * URI Versioning
   * @see https://docs.nestjs.com/techniques/versioning
   */
  app.enableVersioning({
    type: VersioningType.URI,
    // custom URI versiong prefix, which is added after the global path prefix
    prefix: configService.get<string>('URI_VERSIONING_PREFIX'),
    // default URI versiong version
    defaultVersion: configService.get<string>('URI_VERSIONING_DEFAULT'),
  });

  // global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      whitelist: true,
      transform: true,
    }),
  );

  /**
   * global interceptors
   * @see https://docs.nestjs.com/interceptors
   */
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    // global serialization @see https://cloud.tencent.com/developer/ask/sof/1203088
    new ClassSerializerInterceptor(app.get(Reflector), {}),
    new ResponseInterceptor(),
  );

  /**
   * Starts listening for shutdown hooks
   * Due to inherent platform limitations, NestJS has limited support for application shutdown hooks on Windows.
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
   */
  app.enableShutdownHooks();

  /**
   * cookie-parser
   * @see https://docs.nestjs.com/techniques/cookies
   */
  app.use(cookieParser());

  /**
   * enable gzip compression
   * @see https://docs.nestjs.com/techniques/compression
   */
  app.use(compression());

  const port = configService.get<number>('PROJECT_PORT');
  const host = configService.get<string>('PROJECT_HOST');

  await app.listen(port);
}
bootstrap();
