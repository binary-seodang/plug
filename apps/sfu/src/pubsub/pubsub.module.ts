import RedisModuleInitializer from './redis'
import { DynamicModule, Module } from '@nestjs/common'
import { redisOption } from 'pubsub/redis'

@Module({})
export class PubSubModule {
  static forRoot(option: redisOption): DynamicModule {
    const publicher = new RedisModuleInitializer(option)
    const subscriber = new RedisModuleInitializer(option)
    return {
      module: PubSubModule,
      providers: [
        {
          provide: 'PUBSUB_MODULE',
          useValue: { publicher, subscriber },
        },
      ],
    }
  }
}
