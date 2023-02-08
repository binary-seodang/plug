import { Observable } from 'rxjs'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

export interface SFU {
  Call(param: any): Observable<any>
}
