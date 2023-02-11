import { Module } from '@nestjs/common'

import { WrtcService } from './wrtc.service'
@Module({
  imports: [],
  providers: [WrtcService],
  exports: [WrtcService],
})
export class WrtcModule {}
