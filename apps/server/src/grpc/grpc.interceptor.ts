import { throwError, Observable, TimeoutError, catchError } from 'rxjs'
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class GrpcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.error('interceptor !!!')
        if (err instanceof TimeoutError) {
          return throwError(() => new RpcException('rpc connect refused'))
        }
        return throwError(() => err)
      }),
    )
  }
}
