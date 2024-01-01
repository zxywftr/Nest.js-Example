import { DynamicModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class UsersModule {
  static register(options: Record<string, unknown>): DynamicModule {
    return {
      module: UsersModule,
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'DYNAMIC_OPTIONS',
          useValue: options,
        },
      ],
      exports: [UsersService],
      // Uses the forFeature() method to define which repositories are registered in the current scope. With that in place, we can inject the UsersRepository into the UsersService using the @InjectRepository() decorator:
      imports:[TypeOrmModule.forFeature([UserEntity]),HttpModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          timeout: configService.get('HTTP_TIMEOUT'),
          maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
        }),
        inject: [ConfigService],
      })]
    };
  }
}
