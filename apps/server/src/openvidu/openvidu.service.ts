import { ViduSessionOutput, ViduTokenOutput } from './dtos/viduoutput.dto'
import { OpenVidu } from 'openvidu-node-client'
import { Injectable, Inject } from '@nestjs/common'
import { OPENVIDU_MODULE } from 'common/common.constants'

@Injectable()
export class OpenviduService {
  constructor(@Inject(OPENVIDU_MODULE) private readonly vidu: OpenVidu) {}

  async getSession(customSessionId: string): Promise<ViduSessionOutput> {
    try {
      const res = await this.vidu.createSession({ customSessionId })
      return {
        ok: true,
        session: { sessionId: res.sessionId, createdAt: res.createdAt },
      }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async getToken(sessionId: string): Promise<ViduTokenOutput> {
    const session = this.vidu.activeSessions.find(
      (session) => session.sessionId === sessionId,
    )
    if (!session) {
      // Todo : 커스텀 에러 핸들러 정의 필요
      return { ok: false, error: '세션이 없습니다.' }
    }

    const connection = await session.createConnection()
    return { ok: true, token: connection.token }
  }
}
