import { Module } from '@nestjs/common'
import { Sfu } from './sender.controller'

@Module({
  controllers: [Sfu],
  providers: [],
  exports: [],
})
export class SenderModule {}
