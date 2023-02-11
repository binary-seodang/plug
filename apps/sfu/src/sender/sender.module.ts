import { Module } from '@nestjs/common'
import { Plug } from './sender.controller'

@Module({
  controllers: [Plug],
  providers: [],
  exports: [],
})
export class SenderModule {}
