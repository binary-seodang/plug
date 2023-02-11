import { Socket } from 'socket.io/dist/socket'
import Connection from 'wrtc/connection/connection'
import ConnectionManager from 'wrtc/connection/connection.manager'

export default class Channel {
  sockets = new Map<string, Socket>()
  connections = new ConnectionManager()

  constructor(private id: string) {}

  getConnectionById(id: string) {
    return this.connections.getConnectionById(id)
  }

  addConnection(client: Socket, connection: Connection) {
    connection.channel = this
    // this.sockets.set(client.sessionId!, client)
  }

  getConnectionsExcept(id: string) {
    return Array.from(this.connections.getAll()).filter(
      (connection) => connection.id !== id,
    )
  }

  removeConnection(connection: Connection) {
    this.connections.remove(connection.id)
    Array.from(this.connections.getAll()).forEach((c) => {
      c.removeFromOutputConnections(connection.id)
    })
  }
}
