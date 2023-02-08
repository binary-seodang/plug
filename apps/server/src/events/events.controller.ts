import { Controller, Get, OnModuleInit } from '@nestjs/common'
import { ClientGrpc, Client, Transport } from '@nestjs/microservices'
import { SFU } from './events.service'
import { join } from 'path'
import { promisify } from 'util'
import { toPromise } from 'lib/fn'
@Controller('event')
export class EventsContoller implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50500',
      package: 'sfu',
      protoPath: join(__dirname, '../proto/sfu.proto'),
    },
  })
  private readonly client1: ClientGrpc

  private grpc: SFU

  onModuleInit() {
    this.grpc = this.client1.getService('Sfu')
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
    console.log(test, 'TEST CALL')
    console.log('CALL')
    const r = await this.grpc
      .Call({
        type: '123',
        sessionId: '123',
        sdp: '123',
        candidate: '123',
        channelId: '123',
        fromSessionId: '123',
      })
      .toPromise()
    console.log(r)
    return r
  }
}
