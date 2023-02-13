import { Injectable } from '@nestjs/common'
import Channel from 'session/channel'

@Injectable()
export class ChannelManager {
  channels = new Map<string, Channel>()

  getChannelById(id: string) {
    let channel = this.channels.get(id)
    if (!channel) {
      channel = new Channel(id)
      this.channels.set(id, channel)
    }
    return channel
  }
}
