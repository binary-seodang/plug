import { ConfigService } from '@nestjs/config'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { INestApplication } from '@nestjs/common/interfaces'
import { Server } from 'socket.io'

export class RedisIoAdapter extends IoAdapter {
  private readonly configService: ConfigService

  constructor(private readonly app: INestApplication) {
    super(app)
    this.configService = app.get(ConfigService)
  }
  private adapterConstructor: ReturnType<typeof createAdapter>

  async connectToRedis(): Promise<void> {
    try {
      const pubClient = createClient({
        url: this.configService.get('REDIS_URL'),
        password: this.configService.get('REDIS_PASSWORD'),
      })
      const subClient = pubClient.duplicate()
      await Promise.all([pubClient.connect(), subClient.connect()])

      this.adapterConstructor = createAdapter(pubClient, subClient, {
        key: 'plug-',
        publishOnSpecificResponseChannel: true,
        parser: {
          decode(msg) {
            const result: SubscribeMessage = JSON.parse(msg.toString())
            console.log(result)
            const payload = result[1].data[1]
            console.log(payload, ' << payload')
            return result
          },
          encode: (msg: (string | object)[]) => {
            const result = Buffer.from(JSON.stringify(msg))
            return result
          },
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server: Server = super.createIOServer(port, { ...options })
    server.adapter(this.adapterConstructor)
    return server
  }
}
type SubscribeMessage = [
  string,
  { type: number; data: [string, [] | object]; nsp: string },
  { rooms: string[]; except: string[]; flags: object },
]
