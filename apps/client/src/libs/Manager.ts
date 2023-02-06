import { Manager as M, Socket } from 'socket.io-client'
import { SocketOptions } from 'socket.io-client/build/esm/socket'

export class Manager extends M {
  private readonly sockets: { [key: string]: Socket } = {}
  private readonly latestSocketNsp = null
  create_socket(nsp: string, opts?: Partial<SocketOptions> | undefined): Socket {
    //TODO:  최근사용한 소켓 커넥션 종료

    if (this.sockets.hasOwnProperty(nsp)) {
      return this.sockets[nsp]
    }

    // if (this.latestSocketNsp) {

    // }
    const socket = this.socket(nsp, opts)

    socket.publicId = nsp
    socket.listen = function bindEventListnerOnSocket(ev, lisnter) {
      if (this.hasListeners(ev)) {
        socket.off(ev)
      }
      socket.on(ev, lisnter)
      return socket
    }
    this.sockets[nsp] = socket
    return socket
  }

  isExistNsp(url: string) {
    return !!this.sockets[url]
  }
}
