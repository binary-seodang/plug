import { UsersModule } from '../users/users.module'
import { Module } from '@nestjs/common'
import { WorkspacesGateway } from './workspaces.gateway'
import { WrtcModule } from 'src/wrtc/wrtc.module'

@Module({
  imports: [UsersModule, WrtcModule],
  providers: [WorkspacesGateway],
})
export class WorkspacesModule {}
