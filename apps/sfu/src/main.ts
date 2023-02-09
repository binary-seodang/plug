import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50500',
        package: 'sfu',
        protoPath: join(__dirname, './proto/sfu.proto'),
      },
    },
  )
  app.listen()
  new Logger('INIT').localInstance.log('SFU OPEN')
}
bootstrap()
