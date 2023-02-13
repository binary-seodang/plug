import ConnectionManager from 'wrtc/connection/connection.manager'
import ChannelManager from 'wrtc/channel/channel.manager'
import { PrismaService } from 'prisma/prisma.service'
import { GrpcInterceptor } from './../grpc/grpc.interceptor'
import { Controller, UseInterceptors } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata } from '@grpc/grpc-js'
import { CreateConnectionDto } from 'wrtc/dtos/create-connection.dto'
@Controller('sender')
@UseInterceptors(GrpcInterceptor)
export class Plug {
  private readonly connectionManager = new ConnectionManager()
  private readonly channelManager = new ChannelManager()

  constructor(private readonly prismaService: PrismaService) {}

  @GrpcMethod('Plug', 'call')
  async Call(data: CreateConnectionDto, meta: Metadata) {
    const channel = this.channelManager.getChannelById(data.channelId)
    const connection = this.connectionManager.getConnectionById(data.sessionId)
    channel.addConnection(connection)
    const ok = await this.prismaService.session.upsert({
      where: {
        id: connection.id,
      },
      update: {
        id: connection.id,
        state: data.type,
        disabled: false,
      },
      create: {
        id: connection.id,
        state: data.type,
        disabled: false,
      },
    })

    return data
  }
  @GrpcMethod('Plug', 'ClientIcecandidate')
  async ClientIcecandidate(data: {
    type: string
    sessionId: string
    sdp: string
    channelId: string
  }) {
    const connection = this.connectionManager.getConnectionById(data.sessionId)
    const answer = await connection.receiveCall(data.sdp)

    // console.log(answer, ' ClientIcecandidate')

    return { sessionId: connection.id, ...answer }
  }
}
