import type { LeaveParams } from '@plug/proto/types/plug/LeaveParams'
import { PrismaService } from 'prisma/prisma.service'
import { GrpcInterceptor } from './../grpc/grpc.interceptor'
import { Controller, UseInterceptors } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js'

import { Observable } from 'rxjs'
import { Signal } from '@plug/proto'

import { SessionService } from 'session/session.service'
import { Empty } from '@plug/proto/types/plug/Empty'

interface PlugGrpc {
  Call(Signal: Signal): Observable<Signal>
  call(Signal: Signal): Observable<Signal>
  sendOffer(Signal: Signal): Observable<Signal>
  ClientIcecandidate(Signal: Signal): Observable<object>
  answer(Signal: Signal): Observable<null>
  Answer(Signal: Signal): Observable<null>
}

@Controller('sender')
@UseInterceptors(GrpcInterceptor)
export class Plug {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionService: SessionService,
  ) {}
  @GrpcMethod('Plug', 'call')
  async Call(signal: Signal, meta: Metadata, call: ServerUnaryCall<any, any>) {
    try {
      const { connection, answer } = await this.sessionService.call(signal)
      return { ...signal, sdp: answer.sdp, type: answer.type }
    } catch (err) {
      return signal
    }
  }
  @GrpcMethod('Plug', 'ClientIcecandidate')
  async ClientIcecandidate(data: Signal) {
    return this.sessionService.ClientIcecandidate(data)
  }
  @GrpcMethod('Plug', 'Answer')
  async Answer(data: Signal) {
    return this.sessionService.addIce(data)
  }
  @GrpcMethod('Plug', 'Exit')
  Leave(
    leaveParams: LeaveParams,
    meta: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    console.log('sender leeave', call.request)
    // console.log('sender leeave', leaveParams)
    // this.sessionService.disconnect(leaveParams)
    return {}
  }
}
