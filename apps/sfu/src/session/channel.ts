import { ConnectionManager } from './connection-manager.service'
import { Connection } from './connection'

export default class Channel {
  connections = new ConnectionManager()

  constructor(public id: string) {}

  getConnectionManager() {
    return this.connections
  }
  addConnection(connection: Connection) {
    connection.addChannel(this)
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
