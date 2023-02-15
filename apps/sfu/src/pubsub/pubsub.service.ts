import { Inject, Injectable } from '@nestjs/common'
import { PUBSUB_MODULE } from 'common/common.constant'
import { dispatchArgs } from 'session/types/actions'
import { PubSub } from './redis'

@Injectable()
export class PubsubService {
  constructor(@Inject(PUBSUB_MODULE) public readonly Pubsub: PubSub) {}

  getPublisher() {
    return this.Pubsub.publicher
  }

  getSubscriber() {
    return this.Pubsub.subscriber
  }

  publish({ type, ...payload }: dispatchArgs) {
    this.Pubsub.publicher.publish(type, JSON.stringify(payload))
  }
}
