import { Injectable, Inject } from '@nestjs/common'
import { JWT_PROVIDER } from 'common/common.constants'
import { JwtModuleOptions } from './jwt.interface'
import jwt, { Algorithm } from 'jsonwebtoken'

@Injectable()
export class JwtService {
  private readonly algorithm: Algorithm
  constructor(
    @Inject(JWT_PROVIDER) private readonly options: JwtModuleOptions,
  ) {
    this.algorithm = this.options.isRSA ? 'RS256' : 'HS256'
  }
  sign<T>(payload: object | T | any) {
    const token = jwt.sign(payload, this.options.privKey, {
      algorithm: this.algorithm,
    })
    return token
  }

  verify(token: string) {
    try {
      return jwt.verify(
        token,
        this.options.isRSA ? this.options.pubkey : this.options.privKey,
        {
          algorithms: [this.algorithm],
        },
      )
    } catch {
      return false
    }
  }
}
