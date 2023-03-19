import { OPENVIDU_MODULE } from 'common/common.constants'
import { DynamicModule, Module } from '@nestjs/common'
import { OpenVidu } from 'openvidu-node-client'
import { OpenviduService } from './openvidu.service'
import { OpenviduResolver } from './openvidu.resolver'

class OpenViduConfig {
  OPENVIDU_URL: string
  OPENVIDU_SECRET: string
}

@Module({})
export class OpenviduModule {
  static forRoot(option: OpenViduConfig): DynamicModule {
    const vidu = new OpenVidu(option.OPENVIDU_URL, option.OPENVIDU_SECRET)
    return {
      module: OpenviduModule,
      providers: [
        OpenviduResolver,
        {
          provide: OPENVIDU_MODULE,
          useValue: { vidu },
        },
        OpenviduService,
      ],
      exports: [OpenviduService],
    }
  }
}
