import { Injectable, UseInterceptors } from '@nestjs/common'
import { Inject } from '@nestjs/common/decorators'
import { OnModuleInit } from '@nestjs/common/interfaces'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { toPromise } from '@plug/utils'
import { GRPC_CLIENT } from 'common/common.constants'
import { Observable } from 'rxjs'
import { Signal } from '@plug/proto'
import type { LeaveParams } from '@plug/proto/types/plug/LeaveParams'
import { GrpcInterceptor } from './grpc.interceptor'
interface ConnectDto {
  sessionId: string
  channelId: string
}

interface SendOffer extends ConnectDto {
  sdp: string
}

interface PlugGrpc {
  Call(Signal: Signal): Observable<Signal>
  call(Signal: Signal): Observable<Signal>
  sendOffer(Signal: Signal): Observable<Signal>
  ClientIcecandidate(Signal: Signal): Observable<object>
  Answer(Signal: Signal): Observable<null>
  addIce(Signal: Signal): Observable<Signal>
  Leave(Signal: LeaveParams): Observable<null>
}

@Injectable()
@UseInterceptors(GrpcInterceptor)
export class GrpcService implements OnModuleInit {
  private grpc: PlugGrpc
  constructor(@Inject(GRPC_CLIENT) private readonly client: ClientGrpcProxy) {}

  onModuleInit() {
    this.grpc = this.client.getService('Plug')
  }

  async connect(param: Signal) {
    try {
      const result = await toPromise(this.grpc.call(param))
      console.log(result, '<<< result')
      return {}
    } catch {
      return false
    }
    //{ ...signal, sdp: answer.sdp, type: answer.type }
  }
  async ClientIcecandidate(signal: Signal) {
    try {
      const result = await toPromise(
        this.grpc.ClientIcecandidate({
          type: 'offer',
          ...signal,
        }),
      )
      return result
    } catch (err) {
      return
    }
    // TODO : answer offer rpc 만들기
  }

  async addIce(data: Signal) {
    try {
      const result = await toPromise(this.grpc.Answer(data))
      return result
    } catch (err) {
      return
    }
  }

  async Leave(leaveParam: LeaveParams) {
    console.log(leaveParam, 'leaveParam')
    //   try {
    //     const result = await toPromise(this.grpc.Leave(leaveParam))
    //     return result
    //   } catch (err) {
    //     return
    //   }
    // }
  }
}
