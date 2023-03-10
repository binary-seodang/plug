import { Injectable, NestMiddleware } from '@nestjs/common'
import { RoleException } from 'auth/auth-exception.filter'
import { NextFunction, Request, Response } from 'express'
import { UsersService } from 'users/users.service'
import { JwtService } from './jwt.service'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const tokenKey = process.env.AUTH_KEY
    if (tokenKey in req.headers) {
      const token = req.headers[tokenKey]
      const decode = this.jwtService.verify(token.toString())
      if (typeof decode === 'object' && decode.hasOwnProperty('id')) {
        try {
          const { id } = decode
          const { user, ok } = await this.usersService.findById(id)
          if (ok) {
            req['user'] = user
          }
        } catch (e) {
          throw new RoleException()
        }
      }
    }
    next()
  }
}
