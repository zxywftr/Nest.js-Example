import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/config/constatn';

@Module({
  imports: [
    UsersModule.register({
      comment: 'dynamic option',
    }),
    JwtModule.register({
      // We're registering the JwtModule as global to make things easier for us. This means that we don't need to import the JwtModule anywhere else in our application.
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
