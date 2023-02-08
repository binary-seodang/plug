import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { join } from 'path'

async function bootstrap() {
  // const PORT = 4010
  // const app = await NestFactory.create(AppModule)
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     url: '0.0.0.0:50501',
  //     package: 'sfu',
  //     protoPath: join(__dirname, './proto/sfu.proto'),
  //   },
  // })
  // app.listen(PORT, () => {
  //   new Logger().localInstance.log(`app listen on port : ${PORT}`)
  //   app.startAllMicroservices()
  // })

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
  console.log(join(__dirname, './proto/sfu.proto'))
  app.listen()
  console.log('SFU OPEN')
}
bootstrap()
