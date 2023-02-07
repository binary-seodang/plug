import { Module } from '@nestjs/common'
import { UsersModule } from 'users/users.module'
import { WrtcService } from './wrtc.service'
@Module({
  imports: [UsersModule],
  providers: [WrtcService],
  exports: [WrtcService],
})
export class WrtcModule {}
