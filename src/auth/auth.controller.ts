import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  singIn( 
    @Body()
    singInDto: {
      firstName: string;
      lastName: string;
      password: string;
    },
  ) {
    let { firstName, lastName, password } = singInDto;
    return this.authService.signIn(firstName, lastName, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req:any) {
    return req.user;
  }
}
