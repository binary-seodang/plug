import { Catch, ArgumentsHost } from '@nestjs/common'
import { Observable } from 'rxjs'
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices'

@Catch()
export class ExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    console.log('ON FILTER !!!')
    // super.catch(exception, host)
    return new Observable((sub) => {
      console.log(sub)
    })
  }
}
