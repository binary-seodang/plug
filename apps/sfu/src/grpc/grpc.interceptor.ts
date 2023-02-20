import { Metadata } from '@grpc/grpc-js'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable, catchError, TimeoutError, throwError } from 'rxjs'

@Injectable()
export class GrpcInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GrpcInterceptor.name)
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc()
    const data = rpcContext.getData()
    const metaData: Metadata = rpcContext.getContext()
    this.logger.log(`CALL PARAM : ${data.type || 'LEAVE'}`)
    this.logger.log(`METADATA : ${JSON.stringify(metaData.toJSON())}`)
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
