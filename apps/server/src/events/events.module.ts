import { UsersModule } from 'users/users.module'
import { Module } from '@nestjs/common'
import { PrismaModule } from 'prisma/prisma.module'
import { EventsGateway } from './events.gateway'
import { WrtcModule } from 'wrtc/wrtc.module'
import { EventsContoller } from './events.controller'

@Module({
  controllers: [EventsContoller],
  imports: [PrismaModule, UsersModule, WrtcModule],
  providers: [EventsGateway],
})
export class EventsModule {}
