import { Injectable, UseInterceptors } from '@nestjs/common'
import { Inject } from '@nestjs/common/decorators'
import { OnModuleInit } from '@nestjs/common/interfaces'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { toPromise } from '@plug/utils'
import { GRPC_CLIENT } from 'common/common.constants'
import { Observable } from 'rxjs'
import { Signal, LeaveParams } from '@plug/proto'
import { GrpcInterceptor } from './grpc.interceptor'

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
  }

  async addIce(data: Signal) {
    try {
      return toPromise(this.grpc.ClientIcecandidate(data))
    } catch (err) {
      return
    }
  }

  async Leave(leaveParam: LeaveParams) {
    return toPromise(this.grpc.Exit(leaveParam))
  }

  async answer(signal: Signal) {
    return toPromise(this.grpc.Answer(signal))
  }
}
