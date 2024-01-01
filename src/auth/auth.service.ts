import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<any> {
    //  You'd only store hashed passwords, and then compare the stored password to a hashed version of the incoming password, thus never storing or exposing user passwords in plain text
    const user = await this.usersService.findByAccount(
      firstName,
      lastName,
      password,
    );
    console.log(user);
    if (user?.pwd !== password) {
      throw new UnauthorizedException();
    }
    const { pwd, ...result } = user;
    return {
        access_token: await this.jwtService.signAsync(result),
    };
  }
}
