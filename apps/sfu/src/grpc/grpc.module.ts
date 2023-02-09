import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { GrpcGuard } from './grpc.guard'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: GrpcGuard,
    },
  ],
})
export class GrpcModule {}
