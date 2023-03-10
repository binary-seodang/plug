import { DynamicModule, Global, Module } from '@nestjs/common'
import { Secret } from 'jsonwebtoken'
import { JWT_PROVIDER } from 'common/common.constants'
import { JwtModuleOptions } from './jwt.interface'
import { JwtService } from './jwt.service'
@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    const { privKey, pubkey } = options || {}
    const key: Secret = privKey
    const pub: Secret = pubkey
    return {
      module: JwtModule,
      providers: [
        {
          provide: JWT_PROVIDER,
          useValue: { ...options, privKey: key, pubkey: pub },
        },
        JwtService,
      ],
      exports: [JwtService],
    }
  }
}
