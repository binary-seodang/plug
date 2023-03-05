import { WsExceptionFilter } from '../sockets/sockets-exception.filter'
import { Inject, UseFilters, Logger } from '@nestjs/common'
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import {
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets/decorators'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets/interfaces'
import { Namespace, Socket, AuthSocket } from 'socket.io'
import { PrismaService } from 'prisma/prisma.service'
import { getServerRoomDto } from './dtos/gateway.dto'

import { UsersService } from 'users/users.service'
import { JwtService } from 'jwt/jwt.service'

import { WSAuthMiddleware } from 'sockets/sockets.middleware'
import { Client, ClientGrpc, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { PlugClient } from '@plug/proto'

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
  transports: ['websocket'],
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_URL,
      package: process.env.GRPC_PACKAGE,
      protoPath: join(__dirname, '../proto/plug.proto'),
    },
  })
  private readonly client1: ClientGrpc

  private grpc: PlugClient

  private readonly logger: Logger

  @WebSocketServer() public io: Namespace

  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(EventsGateway.name)
  }

  onModuleInit() {
    this.grpc = this.client1.getService('Plug')
  }

  @SubscribeMessage('set_nickname')
  async setNickname(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() nickname: string,
  ) {
    client.user
    client.user['nickname'] = nickname
    await this.prismaService.user.upsert({
      where: {
        id: +client.user.id,
      },
      update: {
        nickname,
      },
      create: {
        nickname,
      },
    })
    this.logger.debug(`${nickname} change`)
    return nickname
  }

  handleConnection(@ConnectedSocket() client: AuthSocket) {
    this.logger.debug(`connected : ${client.sessionId}`)
    this.logger.debug(`namespace : ${client.nsp.name}`)

    this.serverRoomChange()
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`disconnected : ${client.id}`)
    this.serverRoomChange()
  }

  async afterInit(io: Namespace) {
    // instrument(io.server, {
    //   auth: false,
    //   mode: 'development',
    // })
    io.use(WSAuthMiddleware(this.jwtService, this.usersService))
    const serverCount = await io.server.sockets.adapter.serverCount()
    this.logger.log(`serverCount : ${serverCount}`)
  }

  private serverRoomChange(roomChangeArgs?: Partial<getServerRoomDto>) {
    const { isEmit } = roomChangeArgs || { isEmit: true }
    const {
      adapter: { rooms, sids },
    } = this.io.server.of('/workspace')
    const AllRooms = Array.from(rooms.keys()).filter(
      (key) => sids.get(key) === undefined,
    )
    if (isEmit) {
      this.io.server.emit('room_change', AllRooms)
    }
    return AllRooms
  }
}
