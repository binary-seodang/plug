import { Socket } from 'socket.io'
import { SocketMiddleware } from 'common/common.type'
import { JwtService } from 'jwt/jwt.service'
import { User } from 'users/entities/user.entity'
import { UsersService } from 'users/users.service'

export class AuthSocket extends Socket {
  user: User
}
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
      const userResult = await userService.findById(isValidated.id)
      if (userResult) {
        socket.user = userResult.user
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
