import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata } from '@grpc/grpc-js'
@Controller('sender')
export class Sfu {
  @GrpcMethod('Sfu', 'Call')
  Call(data: any, meta: Metadata) {
    console.log(data, ',,,,,,,,,,,,,,,,,,,<<<<<<<<<<<<<<<<')
    return {
      type: 'Hello',
      sessionId: '4d613777-3c35-4226-a8f0-d22b2cbb06d5',
      sdp: 'Hello',
      candidate: 'Hello',
      channelId: '098bac96-feaa-4361-a514-258b76e75abd',
      fromSessionId: '158b88e7-607e-456b-922d-35e1b6ff6e3f',
    }
  }
}
