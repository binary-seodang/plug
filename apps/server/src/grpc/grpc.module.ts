import { DynamicModule, Global, Module } from '@nestjs/common'
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices'
import { join } from 'path'
import { GrpcService } from './grpc.service'
import { GRPC_CLIENT } from 'common/common.constants'

const clientOption: ClientsModuleOptions = [
  {
    name: GRPC_CLIENT,
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_URL,
      package: process.env.GRPC_PACKAGE,
      protoPath: join(__dirname, '../proto/plug.proto'),
    },
  },
]
@Module({})
@Global()
export class GrpcModule {
  static forRoot(): DynamicModule {
    return {
      module: GrpcModule,
      imports: [ClientsModule.register(clientOption)],
      providers: [GrpcService],
      exports: [GrpcService],
    }
  }
}
