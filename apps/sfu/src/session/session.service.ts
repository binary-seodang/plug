import type { LeaveParams } from '@plug/proto/types/plug/LeaveParams'
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

  getConnection(channelId: string, sessionId: string) {
    const channel = this.channelManager.getChannelById(channelId)
    return channel
      .getConnectionManager()
      .getConnectionById(sessionId, this.actionCreator())
  }

  async ClientIcecandidate(signal: Signal) {
    const { channelId, sessionId, candidate, fromSessionId } = signal
    const connection = this.getConnection(channelId, sessionId)
    try {
      const parsedCandidate: RTCIceCandidate = JSON.parse(candidate)
      if (sessionId) {
        connection?.addIceCandidateForOutputPeer(sessionId, parsedCandidate)
      } else {
        connection.addIceCandidate(parsedCandidate)
      }
    } catch {}
    return {}
  }

  addIce(data: Signal) {
    const { channelId, sessionId, candidate } = data
    const connection = this.getConnection(channelId, sessionId)
    connection.addIceCandidate(JSON.parse(candidate))
    return
  }
  disconnect(leaveParams: LeaveParams) {
    return this.getConnection(
      leaveParams.channelId,
      leaveParams.sessionId,
    ).dispose()
  }
}
