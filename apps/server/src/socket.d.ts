import type { Socket as S, RemoteSocket as R } from 'socket.io'
import { User } from './users/entities/user.entity'
declare module 'socket.io' {
  export class AuthSocket extends S {
    constructor() {
      super()
    }
    user: User
    sessionId: string
  }
  export class PublicSocket extends S {}
  export class RemoteSocket extends R {
    readonly user?: User
  }
}
