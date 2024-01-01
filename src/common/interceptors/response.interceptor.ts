import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, catchError, map, throwError, timeout } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  // Nest interceptors work with both synchronous and asynchronous intercept() methods. You can simply switch the method to async if necessary.
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      // When your endpoint doesn't return anything after a period of time, you want to terminate with an error response.
      timeout(5000),
      map((data) => ({ data, code: HttpStatus.OK })),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
      // Another interesting use-case is to take advantage of RxJS's catchError() operator to override thrown exceptions:
      // catchError((err) => throwError(() => new BadGatewayException())),
    );
  }
}
