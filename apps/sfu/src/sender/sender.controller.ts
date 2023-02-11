import { PrismaService } from 'prisma/prisma.service'
import { GrpcInterceptor } from './../grpc/grpc.interceptor'
import { Controller, UseInterceptors } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata } from '@grpc/grpc-js'
@Controller('sender')
export class Sfu {
  constructor(private readonly prismaService: PrismaService) {}

  @UseInterceptors(GrpcInterceptor)
  @GrpcMethod('Plug', 'Call')
  async Call(data: any, meta: Metadata) {
    console.log()
    // console.log(data, ',,,,,,,,,,,,,,,,,,,<<<<<<<<<<<<<<<<')
    // console.log(meta.toJSON())
    // console.log(meta)
    return data
  }
}
