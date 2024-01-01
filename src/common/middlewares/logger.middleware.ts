import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('logger middleware has been executed');
    // if the current middleware function does not end the request-response cycle,
    // it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
    next();
  }
}
