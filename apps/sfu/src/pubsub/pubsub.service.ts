import { Inject, Injectable } from '@nestjs/common'
import { PUBSUB_MODULE } from 'common/common.constant'
import { PubSub } from './redis'

@Injectable()
export class PubsubService {
  constructor(@Inject(PUBSUB_MODULE) private readonly Pubsub: PubSub) {
    Pubsub.subscriber.connect().then(() => {
      Pubsub.subscriber.subscribe('plug-#/workspace#12#', (data) =>
        console.log(JSON.parse(data), ' <<<plug-#/workspace#12#'),
      )
    })
  }
}
