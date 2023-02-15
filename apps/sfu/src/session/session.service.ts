import { Signal } from '@plug/proto'
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

  async call(signal: Signal) {
    const { sessionId, sdp, channelId } = signal
    const channel = this.channelManager.getChannelById(channelId)

    const connection = channel
      .getConnectionManager()
      .getConnectionById(sessionId, this.actionCreator())
    channel.addConnection(connection)
    const answer = await connection.receiveCall(sdp)

    return { answer, connection }
  }

  getConnection(sessionId: string) {
    return this.connectionManager.getConnectionById(
      sessionId,
      this.actionCreator(),
    )
  }

  async ClientIcecandidate(signal: Signal) {
    const { sessionId, candidate, fromSessionId } = signal
    const connection = this.connectionManager.getConnectionById(
      fromSessionId,
      this.actionCreator(),
    )
    try {
      const parsedCandidate = JSON.parse(candidate)
      if (sessionId) {
        connection?.addIceCandidateForOutputPeer(sessionId, parsedCandidate)
      } else {
        connection?.addIceCandidate(parsedCandidate)
      }
    } catch {}
    return {}
  }

  addIce(data: any) {
    const connection = this.getConnection(data.sessionId)
    connection.addIceCandidate(JSON.parse(data.candidate))
    return
  }
}
