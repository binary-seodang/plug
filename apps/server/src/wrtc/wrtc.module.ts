import { Module } from '@nestjs/common'
import { WrtcService } from './wrtc.service'
@Module({
  providers: [WrtcService],
  exports: [WrtcService],
})
export class WrtcModule {}
