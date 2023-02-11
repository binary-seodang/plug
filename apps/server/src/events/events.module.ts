import { UsersModule } from 'users/users.module'
import { Module } from '@nestjs/common'
import { PrismaModule } from 'prisma/prisma.module'
import { EventsGateway } from './events.gateway'
import { EventsContoller } from './events.controller'

@Module({
  controllers: [EventsContoller],
  imports: [PrismaModule, UsersModule],
  providers: [EventsGateway],
})
export class EventsModule {}
