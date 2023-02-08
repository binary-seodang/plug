import { UsersModule } from 'users/users.module'
import { Module } from '@nestjs/common'
import { PrismaModule } from 'prisma/prisma.module'
import { EventsGateway } from './events.gateway'
import { WrtcModule } from 'wrtc/wrtc.module'
import { ClientsModule } from '@nestjs/microservices/module'
import { Transport } from '@nestjs/microservices/enums'
import { join } from 'path'
import { GRPC_SERVICE } from 'common/common.constants'

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    WrtcModule,
    ClientsModule.register([
      {
        name: GRPC_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'sfu',
          protoPath: join(__dirname, '../proto/sfu.proto'),
        },
      },
    ]),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
