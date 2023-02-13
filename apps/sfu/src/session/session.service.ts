import { ConnectionManager } from './connection-manager.service'
import { Injectable } from '@nestjs/common'
import { ChannelManager } from './channel-manager.service'
import { Dispatch, dispatchArgs } from './types/actions'
import { PubsubService } from 'pubsub/pubsub.service'

@Injectable()
export class SessionService {
  constructor(
    private readonly channelManager: ChannelManager,
    private readonly connectionManager: ConnectionManager,
    private readonly pubsubService: PubsubService,
  ) {}

  actionCreator(): Dispatch {
    return (args: dispatchArgs) => this.pubsubService.publish(args)
  }

  call(channelId: string, sessionId: string) {
    const channel = this.channelManager.getChannelById(channelId)
    const connection = this.connectionManager.getConnectionById(
      sessionId,
      this.actionCreator(),
    )
    return { channel, connection }
  }

  getConnection(sessionId: string) {
    return this.connectionManager.getConnectionById(
      sessionId,
      this.actionCreator(),
    )
  }

  async ClientIcecandidate(data: {
    type: string
    sessionId: string
    sdp: string
    channelId: string
  }) {
    const connection = this.getConnection(data.sessionId)
    const answer = await connection.receiveCall(data.sdp)
    return { sessionId: connection.id, ...answer }
  }
}
