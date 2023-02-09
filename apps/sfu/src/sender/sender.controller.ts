import { PrismaService } from 'prisma/prisma.service'
import { GrpcInterceptor } from './../grpc/grpc.interceptor'
import { Controller, UseInterceptors } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata } from '@grpc/grpc-js'
import { OnModuleInit } from '@nestjs/common/interfaces'
@Controller('sender')
export class Sfu implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {
    await this.prismaService.sfuServer.create({
      data: {
        address: '123',
      },
    })
    console.log(await this.prismaService.sfuServer.findMany())
  }

  @UseInterceptors(GrpcInterceptor)
  @GrpcMethod('Sfu', 'Call')
  Call(data: any, meta: Metadata) {
    // console.log(data, ',,,,,,,,,,,,,,,,,,,<<<<<<<<<<<<<<<<')
    // console.log(meta.toJSON())
    // console.log(meta)
    return data
  }
}
