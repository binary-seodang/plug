import { OpenviduService } from './openvidu.service'
import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql'
import { ViduSession } from './entities/vidu.entitiy'
import { Role } from 'auth/role.decorator'
import { ViduSessionOutput, ViduTokenOutput } from './dtos/viduoutput.dto'

@Resolver(() => ViduSession)
export class OpenviduResolver {
  constructor(private readonly openviduService: OpenviduService) {}
  @ResolveReference()
  async resolveReference(reference: {
    __typename: string
    sessionId: string
  }): Promise<ViduSessionOutput> {
    console.log('?????????????', reference)
    return this.openviduService
      .getSession(reference.sessionId)
      .then((res) => res)
  }

  /**
   *
   * @deprecated 통합 리졸버 테스트 후 제거예정
   */
  @Query(() => ViduSessionOutput)
  @Role(['Any'])
  getSession(@Args('sessionId') sessionId: string) {
    return this.openviduService.getSession(sessionId)
  }

  /**
   *
   * @deprecated 통합 리졸버 테스트 후 제거예정
   */
  @Query(() => ViduTokenOutput)
  @Role(['Any'])
  getToken(@Args('sessionId') sessionId: string) {
    return this.openviduService.getToken(sessionId)
  }

  @Query(() => ViduTokenOutput)
  @Role(['Any'])
  async getTokenConnection(@Args('sessionId') roomName: string) {
    const session = await this.openviduService.getSession(roomName)
    return this.openviduService.getToken(session.session.sessionId)
  }
}
