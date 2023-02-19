import type { LeaveParams } from '@plug/proto/types/plug/LeaveParams'
import { PrismaService } from 'prisma/prisma.service'
import { GrpcInterceptor } from './../grpc/grpc.interceptor'
import { Controller, UseInterceptors } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata } from '@grpc/grpc-js'

import { Observable } from 'rxjs'
import { Signal } from '@plug/proto'

import { SessionService } from 'session/session.service'

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
  async Call(signal: Signal) {
    console.log(signal, 'sender calll << ')
    const { connection, answer } = await this.sessionService.call(signal)
    // const ok = await this.prismaService.session.upsert({
    //   where: {
    //     id: connection.id,
    //   },
    //   update: {
    //     id: connection.id,
    //     state: signal.type,
    //     disabled: false,
    //   },
    //   create: {
    //     id: connection.id,
    //     state: signal.type,
    //     disabled: false,
    //   },
    // })
    //
    console.log(
      { ...signal, sdp: answer.sdp, type: answer.type },
      'return sender  call????? ',
    )
    return { ...signal, sdp: answer.sdp, type: answer.type }
  }
  @GrpcMethod('Plug', 'ClientIcecandidate')
  async ClientIcecandidate(data: Signal) {
    return this.sessionService.ClientIcecandidate(data)

    // return { sessionId: connection.id, ...answer }
  }
  @GrpcMethod('Plug', 'Answer')
  async Answer(data: Signal) {
    return this.sessionService.addIce(data)
    // return this.sessionService.ClientIcecandidate(data)

    // return { sessionId: connection.id, ...answer }
  }
  @GrpcMethod('Plug', 'Leave')
  async Leave(leaveParams: LeaveParams) {
    this.sessionService.disconnect(leaveParams)
    return {}
    // return this.sessionService.ClientIcecandidate(data)

    // return { sessionId: connection.id, ...answer }
  }
}
