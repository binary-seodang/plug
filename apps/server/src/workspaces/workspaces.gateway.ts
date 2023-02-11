import { WrtcService } from 'wrtc/wrtc.service'
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
import { CreateConnectionDto } from 'wrtc/dtos/create-connection.dto'

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
  private readonly logger = new Logger(WorkspacesGateway.name)
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly wrtcService: WrtcService,
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
    this.serverRoomChange()
    return { joinedUserNickname: nickname, userList, ok: true }
  }

  @SubscribeMessage('stream')
  async onStream(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() createConnectionDto: CreateConnectionDto,
  ) {
    const peer = await this.wrtcService.createConnection(
      client,
      createConnectionDto,
    )
    return peer
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

  @SubscribeMessage('offer')
  requestRTCOffer(
    @ConnectedSocket() client: Socket,
    // TODO : Offer Type assertion
    @MessageBody('offer') offer: any,
    @MessageBody('roomName') roomName: string,
  ) {
    client.to(roomName).emit('offer', offer)
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

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`disconnected : ${client.id}`)
    this.serverRoomChange()
  }

  async afterInit(io: Namespace) {
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
