import { Signal } from '@plug/proto'
import { redisClient } from './../redis/redis.adapter'
import { JwtService } from 'jwt/jwt.service'
import { UsersService } from 'users/users.service'
import { WSAuthMiddleware } from 'sockets/sockets.middleware'
import { UseFilters, Logger } from '@nestjs/common'
import { WebSocketGateway } from '@nestjs/websockets'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets/decorators'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets/interfaces'
import { Namespace, Socket, AuthSocket } from 'socket.io'
import { getServerRoomDto } from 'events/dtos/gateway.dto'
import { WsExceptionFilter } from 'sockets/sockets-exception.filter'
import { GrpcService } from 'grpc/grpc.service'
import { createClient } from 'redis'
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/workspace',
  transports: ['websocket'],
})
export class WorkspacesGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  //
  private readonly logger = new Logger(WorkspacesGateway.name)
  private subscriber: redisClient
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly grpcService: GrpcService,
  ) {}
  @WebSocketServer() public io: Namespace
  @SubscribeMessage('join_room')
  async joinRoom(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() roomName: string,
  ) {
    const { nickname } = client.user
    if (!nickname) {
      return { ok: false }
    }
    client.join(roomName)
    const userList = await this.findJoinedUsers(roomName)
    client
      .to(roomName)
      .emit('welcome', { joinedUserNickname: nickname, userList, ok: true })
    client.roomName = roomName
    this.serverRoomChange()
    return { joinedUserNickname: nickname, userList, ok: true }
  }

  @SubscribeMessage('offer')
  async onStream(
    @ConnectedSocket() client: Socket,
    @MessageBody() signal: Signal,
  ) {
    try {
      const result = await this.grpcService.connect({
        sessionId: client.id,
        fromSessionId: client.id,
        candidate: '',
        ...signal,
      })

      this.subscriber.subscribe('icecandidate', async (data) => {
        const payload = JSON.parse(data)
        // console.log(payload)
        this.io.server
          .of('/workspace')
          .in(payload.channelId)
          .emit('icecandidate', payload.candidate)
      })
      this.subscriber.subscribe('offer', (data) => {
        const payload = JSON.parse(data)
        this.io.server
          .of('/workspace')
          .in(payload.channelId)
          .emit('offer', payload)
      })
      return result
    } catch (err) {
      return err
    }
  }

  @SubscribeMessage('add-ice')
  async sendCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      candidate: RTCIceCandidate
      type: 'icecandidate'
      channelId: string
    },
  ) {
    return this.grpcService.addIce({
      channelId: data.channelId,
      sessionId: client.id,
      candidate: JSON.stringify(data.candidate),
      type: data.type,
    })
  }

  @SubscribeMessage('leave_room')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: string,
  ) {
    await client.leave(roomName)
    const userList = await this.findJoinedUsers(roomName)
    client.to(roomName).emit('leave_room', { userList, ok: true })
    this.serverRoomChange()
    return roomName
  }

  @SubscribeMessage('answer')
  sendRTCanswer(
    @ConnectedSocket() client: Socket,
    @MessageBody('answer') answer: string,
    @MessageBody('roomName') roomName: string,
  ) {
    client.to(roomName).emit('answer', answer)
  }

  @SubscribeMessage('ice')
  requestRTCICECandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody('ice') ice: any,
    @MessageBody('roomName') roomName: string,
  ) {
    client.to(roomName).emit('ice', ice)
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`connected : ${client.id}`)
    this.logger.debug(`namespace : ${client.nsp.name}`)
    this.serverRoomChange()
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`disconnected : ${client.id}`)
    this.logger.log(`LEAVE : ${client.id}`)
    // await this.grpcService.Leave({
    //   channelId: client.roomName,
    //   sessionId: client.id,
    // })
    this.serverRoomChange()
  }

  async afterInit(io: Namespace) {
    this.subscriber = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    })

    await this.subscriber.connect()
    io.use(WSAuthMiddleware(this.jwtService, this.usersService))
    const serverCount = await io.server.sockets.adapter.serverCount()
    this.logger.log(`serverCount : ${serverCount}`)
  }
  private async findJoinedUsers(roomName: string) {
    const socketsInCurrentRoom = await this.io.server
      .of('/workspace')
      .in(roomName)
      .fetchSockets()
    return socketsInCurrentRoom.map((socket) => socket.user.nickname)
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
