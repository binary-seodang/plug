import { Injectable } from '@nestjs/common'
import { Inject } from '@nestjs/common/decorators'
import { OnModuleInit } from '@nestjs/common/interfaces'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { toPromise } from '@plug/utils'
import { GRPC_CLIENT } from 'common/common.constants'
import { Observable } from 'rxjs'
import { Signal } from '@plug/proto'
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
}

@Injectable()
export class GrpcService implements OnModuleInit {
  private grpc: PlugGrpc
  constructor(@Inject(GRPC_CLIENT) private readonly client: ClientGrpcProxy) {}

  onModuleInit() {
    this.grpc = this.client.getService('Plug')
  }

  async connect(param: ConnectDto) {
    try {
      const result = await toPromise(
        this.grpc.call({ ...param, type: 'connection' }),
      )
      return result
    } catch {
      return true
    }
  }

  async sendOffer(sendOfferDto: SendOffer) {
    try {
      const result = await toPromise(
        this.grpc.ClientIcecandidate({
          type: 'offer',
          ...sendOfferDto,
        }),
      )
      return result
    } catch (err) {
      return
    }
    // TODO : answer offer rpc 만들기
  }
}
