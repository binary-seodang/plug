import { Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { Server, ServerCredentials } from '@grpc/grpc-js'
import proto, { PlugHandlers } from '@plug/proto'

async function bootstrap() {
  const server = new Server()
  const handler: PlugHandlers = {
    call(call, callback) {
      console.log(call)
      callback(null)
    },
    Answer: undefined,
    ClientIcecandidate: undefined,
    Leave: undefined,
    ListenSignal: undefined,
  }
  server.addService(proto.plug.Plug.service, {
    async Call(call, callback) {
      /*
        1. create or get channel
        2. create new connection via connection manager
        3. push connection to the channel
      */

      callback(null, {
        type: '123',
        sessionId: '123',
        sdp: '123',
        candidate: '123',
        channelId: '123',
        fromSessionId: '123',
      })
    },
  })
  server.bindAsync(
    '0.0.0.0:50500',
    ServerCredentials.createInsecure(),
    (err, port) => {
      server.start()
      console.log(`Running server on ${port}...`)
    },
  )
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.GRPC,
  //   options: {
  //     url: '0.0.0.0:50500',
  //     package: 'plug',
  //     protoPath: join(__dirname, './proto/sfu.proto'),
  //   },
  // })
  // app.listen()
  new Logger('INIT').localInstance.log('SFU OPEN')
}
bootstrap()
