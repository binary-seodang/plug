import { Controller, Get, OnModuleInit } from '@nestjs/common'
import { ClientGrpc, Client, Transport } from '@nestjs/microservices'
import { SFU } from './events.service'
import { join } from 'path'
import { toPromise } from '@plug/utils'
@Controller('event')
export class EventsContoller implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_URL,
      package: process.env.GRPC_PACKAGE,
      protoPath: join(__dirname, '../proto/plug.proto'),
    },
  })
  private readonly client1: ClientGrpc

  private grpc: SFU

  onModuleInit() {
    // console.log(this.client1, ' <<<<')
    // this.grpc = this.client1.getService('Plug')
  }

  @Get()
  async test() {
    const test = await toPromise(
      this.grpc.Call({
        type: '123',
        sessionId: '123',
        sdp: '123',
        candidate: '123',
        channelId: '123',
        fromSessionId: '123',
      }),
    )
    return test
  }
}
