import { ClientsModule, Transport } from '@nestjs/microservices'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { GrpcGuard } from './grpc.guard'
import { GrpcController } from './grpc.controller'

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'REDIS_SERVICE',
    //     transport: Transport.REDIS,
    //     options: {
    //       url: 'localhost:4000',
    //       password: '1234',
    //     },
    //   },
    // ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GrpcGuard,
    },
  ],
  controllers: [GrpcController],
})
export class GrpcModule {}
