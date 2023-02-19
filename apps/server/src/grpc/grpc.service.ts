import { Injectable, UseInterceptors } from '@nestjs/common'
import { Inject } from '@nestjs/common/decorators'
import { OnModuleInit } from '@nestjs/common/interfaces'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { toPromise } from '@plug/utils'
import { GRPC_CLIENT } from 'common/common.constants'
import { Observable } from 'rxjs'
import { Signal, LeaveParams } from '@plug/proto'
import { GrpcInterceptor } from './grpc.interceptor'
import { Metadata } from '@grpc/grpc-js'

interface PlugGrpc {
  Call(Signal: Signal): Observable<Signal>
  call(Signal: Signal): Observable<Signal>
  sendOffer(Signal: Signal): Observable<Signal>
  ClientIcecandidate(Signal: Signal): Observable<object>
  Answer(Signal: Signal): Observable<null>
  addIce(Signal: Signal): Observable<Signal>
  Exit(Signal: LeaveParams)
  leave(Signal: LeaveParams): Observable<LeaveParams>
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
      return toPromise(this.grpc.call(param))
    } catch {
      return false
    }
  }
  async ClientIcecandidate(signal: Signal) {
    try {
      return toPromise(
        this.grpc.ClientIcecandidate({
          type: 'offer',
          ...signal,
        }),
      )
    } catch (err) {
      return
    }
    // TODO : answer offer rpc 만들기
  }

  async addIce(data: Signal) {
    try {
      return toPromise(this.grpc.Answer(data))
    } catch (err) {
      return
    }
  }

  async Leave(leaveParam: LeaveParams) {
    try {
      const meta = new Metadata()
      meta.add('test', '123')
      console.log(meta)
      return this.grpc.Exit(leaveParam)
    } catch (err) {
      return
    }
  }
}
