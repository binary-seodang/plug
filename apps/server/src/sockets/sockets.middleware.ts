import { SocketMiddleware } from 'common/common.type'
import { JwtService } from 'jwt/jwt.service'
import { AuthSocket } from 'socket.io'
import { v4 as uuid } from 'uuid'
import { UsersService } from 'users/users.service'

export const WSAuthMiddleware = (
  jwtService: JwtService,
  userService: UsersService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    const {
      handshake: {
        auth: { token },
      },
    } = socket
    const isValidated = jwtService.verify(token) as {
      id: number
    }
    if (isValidated.id) {
      const { ok, user: existUser } = await userService.findById(isValidated.id)
      if (ok) {
        const { id, sessionId: existUserSessionId } = existUser
        let sessionId = existUserSessionId
        let user = existUser
        if (!existUserSessionId) {
          sessionId = uuid()
          user = await userService.updateSession({
            id,
            sessionId,
          })
        }
        socket.user = user
        socket.sessionId = sessionId
        next()
      } else {
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        })
      }
    } else {
      next({
        name: 'Unauthorizaed',
        message: 'Unauthorizaed',
      })
    }
  }
}
