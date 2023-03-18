import type { LeaveParams } from '@plug/proto/types/plug/LeaveParams'
import { PrismaService } from 'prisma/prisma.service'
import { GrpcInterceptor } from './../grpc/grpc.interceptor'
import { Controller, UseInterceptors } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js'
import { Signal } from '@plug/proto'
import { SessionService } from 'session/session.service'

interface PlugGrpc {
  Call(
    Signal: Signal,
    meta: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<Signal>
  ClientIcecandidate(
    Signal: Signal,
    meta: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<void | object>
  Answer(
    Signal: Signal,
    meta: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<void>
}

enum IceType {
  icecandidate = 'icecandidate',
  clientIce = 'clientIce',
}

@Controller('sender')
@UseInterceptors(GrpcInterceptor)
export class Plug implements PlugGrpc {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionService: SessionService,
  ) {}
  @GrpcMethod('Plug', 'call')
  async Call(signal: Signal) {
    try {
      const { answer } = await this.sessionService.call(signal)
      return { ...signal, sdp: answer.sdp, type: answer.type }
    } catch (err) {
      return signal
    }
  }
  @GrpcMethod('Plug', 'ClientIcecandidate')
  async ClientIcecandidate(data: Signal) {
    if (data.type === IceType.icecandidate) {
      return this.sessionService.addIce(data)
    } else if (data.type === IceType.clientIce) {
      return this.sessionService.ClientIcecandidate(data)
    }
  }
  @GrpcMethod('Plug', 'Exit')
  async Exit(leaveParams: LeaveParams) {
    this.sessionService.disconnect(leaveParams)
    return Promise.resolve({})
  }
  @GrpcMethod('Plug', 'Answer')
  async Answer(signal: Signal) {
    return this.sessionService.receiveAnswer(signal)
  }
}
