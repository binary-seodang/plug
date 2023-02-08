import { GrpcMethod } from '@nestjs/microservices'
import { WrtcService } from 'wrtc/wrtc.service'
import { WsExceptionFilter } from '../sockets/sockets-exception.filter'
import { Inject, UseFilters, Logger, OnModuleInit } from '@nestjs/common'
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
import { WSAuthMiddleware } from 'sockets/sockets.middleware'
import { UsersService } from 'users/users.service'
import { JwtService } from 'jwt/jwt.service'
import { instrument } from '@socket.io/admin-ui'
import { GRPC_SERVICE } from 'common/common.constants'
import { ClientGrpc } from '@nestjs/microservices'
import { SFU } from './events.service'

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
  transports: ['websocket'],
})
export class EventsGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    OnModuleInit
{
  private readonly logger = new Logger(EventsGateway.name)
  private rpcService: SFU
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(GRPC_SERVICE) private readonly grpcClient: ClientGrpc,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly wrtcService: WrtcService,
  ) {}
  onModuleInit() {
    this.rpcService = this.grpcClient.getService('SFU')
    // console.log(this.grpcClient.getClientByServiceName('SFU'))
    console.log(this.rpcService)
    setTimeout(() => {
      this.rpcService.call({
        type: '123',
        sessionId: '123',
        sdp: '123',
        candidate: '123',
        channelId: '123',
        fromSessionId: '123',
      })
      console.log('O')
    }, 300)
  }
  @WebSocketServer() public io: Namespace

  @GrpcMethod('SFU')
  Call(param: any) {
    console.log(param)
    return {
      ...param,
    }
  }
  @SubscribeMessage('set_nickname')
  async setNickname(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() nickname: string,
  ) {
    // const user = this.findCurrentClient(client)
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

  // @SubscribeMessage('leave_room')
  // async leaveRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() roomName: string,
  // ) {
  //   await client.leave(roomName)
  //   const userList = await this.findJoinedUsers(roomName)
  //   client.nsp.to(roomName).emit('leave', { userList })
  //   this.serverRoomChange()
  //   return roomName
  // }

  handleConnection(@ConnectedSocket() client: AuthSocket) {
    this.logger.debug(`connected : ${client.id}`)
    this.logger.debug(`namespace : ${client.nsp.name}`)
    this.wrtcService.addConnection(client.sessionId)

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
