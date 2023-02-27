import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class GrpcGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToRpc().getData()
    // 이거 잘동작하는구나.. 며칠을 너때문에 고생했단다
    return !!ctx.sessionId
  }
}
