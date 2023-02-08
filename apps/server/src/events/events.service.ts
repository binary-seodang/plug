import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

export interface SFU {
  call: (param: any) => any
}
