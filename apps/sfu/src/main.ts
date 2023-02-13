import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'

async function bootstrap() {
  const logger = new Logger('INIT').localInstance
  try {
    const GRPC = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL,
          package: process.env.GRPC_PACKAGE,
          protoPath: join(__dirname, './proto/plug.proto'),
        },
      },
    )
    GRPC.listen()
  } catch (err) {
    logger.error(err)
  }
}
bootstrap()
