import { Injectable } from '@nestjs/common'
import { AuthSocket } from 'socket.io'
import { User } from 'users/entities/user.entity'
import { UsersService } from 'users/users.service'
import ChannelManager from './channel/channel.manager'
import Connection from './connection/connection'
import ConnectionManager from './connection/connection.manager'
import { CreateConnectionDto } from './dtos/create-connection.dto'
@Injectable()
export class WrtcService {
  private readonly Connections = new ConnectionManager()
  private readonly Channels = new ChannelManager()
  constructor(private readonly usersService: UsersService) {}
  async createConnection(
    client: AuthSocket,
    { channelId, sdp }: CreateConnectionDto,
  ) {
    const channel = this.Channels.getChannelById(channelId)
    const connection = this.Connections.getConnectionById(client.sessionId)
    channel.addConnection(client, connection)
    return await connection.receiveCall(sdp, connection)
  }

  addConnection(sessionId: string) {
    return this.Connections.getConnectionById(sessionId)
  }

  async disconnect(user: User) {
    return this.usersService.updateSession({ id: user.id, sessionId: null })
  }

  getAllConnection() {
    return this.Connections.getAll()
  }
}
