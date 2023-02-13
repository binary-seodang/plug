import { Injectable } from '@nestjs/common'
import { Connection } from './Connection'
import { Dispatch } from './types/actions'

@Injectable()
export class ConnectionManager {
  connections = new Map<string, Connection>()

  getConnectionById(id: string, dispatch: Dispatch) {
    let connection = this.connections.get(id)
    if (!connection) {
      connection = new Connection(id, dispatch)
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
