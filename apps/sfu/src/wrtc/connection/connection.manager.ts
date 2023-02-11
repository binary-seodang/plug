import Connection from './Connection'

export default class ConnectionManager {
  connections = new Map<string, Connection>()

  getConnectionById(id: string) {
    let connection = this.connections.get(id)
    if (!connection) {
      connection = new Connection(id)
      this.connections.set(id, connection)
    }
    return connection
  }

  getAll() {
    return this.connections.values()
  }

  remove(id: string) {
    this.connections.delete(id)
  }
}
