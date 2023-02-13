import { SessionService } from './session.service'
import { Global, Module } from '@nestjs/common'
import { ChannelManager } from './channel-manager.service'
import { ConnectionManager } from './connection-manager.service'

@Module({
  providers: [SessionService, ChannelManager, ConnectionManager],
  exports: [SessionService],
})
@Global()
export class SessionModule {}
