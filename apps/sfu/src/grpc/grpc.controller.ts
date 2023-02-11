import { Inject, Controller, OnModuleInit } from '@nestjs/common'
import {
  Client,
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
  Transport,
} from '@nestjs/microservices'

@Controller('grpc')
export class GrpcController implements OnModuleInit {
  // constructor(@Inject('REDIS_SERVICE') private client: ClientProxy) {}
  @Client({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 7000,
      password: '1234',
    },
  } as any)
  client: ClientProxy

  async onModuleInit() {
    try {
      await this.client.connect()
      const res = this.client.emit('test', '123')
      // console.log('OKKK', this.client, res)
    } catch (err) {
      console.log(err)
      console.log(err)
    }
  }

  @MessagePattern('test')
  test(@Payload() data: any[], @Ctx() context: RedisContext) {
    console.log(data)
    console.log(data)
  }
}
