import RedisModuleInitializer from './redis'
import { DynamicModule, Module } from '@nestjs/common'
import { redisOption } from 'pubsub/redis'
import { PubsubService } from './pubsub.service'
import { PUBSUB_MODULE } from 'common/common.constant'

@Module({})
export class PubSubModule {
  static async forRoot(option: redisOption): Promise<DynamicModule> {
    const redisCreator = new RedisModuleInitializer(option)
    const publicher = redisCreator.create()
    const subscriber = publicher.duplicate()
    return {
      module: PubSubModule,
      providers: [
        {
          provide: PUBSUB_MODULE,
          useValue: { publicher, subscriber },
        },
        PubsubService,
      ],
      exports: [PubsubService],
    }
  }
}
