import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Interceptor Before Controller....');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`Interceptor After Controller... ${Date.now() - now}ms`)),
      );
  }
}
