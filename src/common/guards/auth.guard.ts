import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/auth.decoreator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../config/constatn';
import { Public } from '../decorators/public.decorator';
import { ERole } from '../enums/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /*                            controller角色                           */

    // application context
    const http = context.switchToHttp();
    const request = http.getRequest();
    const token = this.extractTokenFromHeader(request);
    // context object
    const ctxClass = context.getClass();
    const ctxHandler = context.getHandler();

    // context info
    const ctxClassName = ctxClass.name;
    const ctxHandlerName = ctxHandler.name;
    const contextType = context.getType();

    /*                            Public路径不需要进行权限校验                           */

    const isPublic = this.reflector.getAllAndOverride<boolean>(Public, [
      ctxHandler,
      ctxClass,
    ]);
    console.log('public decorators',isPublic);
    if (isPublic) {
      console.log('isPublic');
      return true;
    }

    // roles
    const methodRoles = this.reflector.get(Roles, ctxHandler);
    const controllerRoles = this.reflector.get(Roles, ctxClass);
    const mergeRoles = this.reflector.getAllAndMerge(Roles, [
      ctxClass,
      ctxHandler,
    ]);
    const overrideRoles = this.reflector.getAllAndOverride(Roles, [
      ctxClass,
      ctxHandler,
    ]);

    // log
    console.log(
      'AuthGuard',
      contextType,
      ctxClassName,
      ctxHandlerName,
      methodRoles,
      controllerRoles,
      mergeRoles,
      overrideRoles,
    );

    /*                            解析token                           */
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload?.user || ERole.All;
      console.log(payload?.user);
      return mergeRoles.some((role) => payload?.user?.includes(role));
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers.authorization ?? undefined;
    console.log('token',token);
    return token;
  }
}
