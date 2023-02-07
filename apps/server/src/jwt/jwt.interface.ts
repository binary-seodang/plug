import { Secret } from 'jsonwebtoken'

export interface JwtModuleOptions {
  isRSA?: boolean
  privKey: Secret
  pubkey?: Secret
}
