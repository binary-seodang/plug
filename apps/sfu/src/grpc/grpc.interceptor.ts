import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable, catchError, TimeoutError, throwError } from 'rxjs'

@Injectable()
export class GrpcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RpcException('rpc connect refused'))
        }
        return throwError(() => err)
      }),
    )
  }
}
