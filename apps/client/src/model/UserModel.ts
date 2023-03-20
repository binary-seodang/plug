import { Publisher, Subscriber } from 'openvidu-browser'

interface UserModelOption {
  connectionId: string
  audioActive: boolean
  videoActive: boolean
  screenShareActive: boolean
  nickname: string
  streamManager: Subscriber | Publisher | null
  type: 'remote' | 'local'
}

class UserModel {
  // static instance: UserModel
  private connectionId: string = ''
  private audioActive: boolean = true
  private videoActive: boolean = true
  private screenShareActive: boolean = false
  private nickname: string = ''
  private streamManager: Subscriber | Publisher | null = null
  private type: 'remote' | 'local' = 'local'

  // constructor(option: Partial<UserModelOption> = {}) {
  //   if (UserModel.instance) return UserModel.instance
  //   this.connectionId = option.connectionId ?? ''
  //   this.audioActive = option.audioActive ?? true
  //   this.videoActive = option.videoActive ?? true
  //   this.screenShareActive = option.screenShareActive ?? false
  //   this.nickname = option.nickname ?? ''
  //   this.streamManager = option.streamManager ?? null
  //   this.type = option.type ?? 'local'
  // }
  constructor(option: Partial<UserModelOption> = {}) {
    // if (UserModel.instance) return UserModel.instance
    this.connectionId = option.connectionId ?? ''
    this.audioActive = option.audioActive ?? true
    this.videoActive = option.videoActive ?? true
    this.screenShareActive = option.screenShareActive ?? false
    this.nickname = option.nickname ?? ''
    this.streamManager = option.streamManager ?? null
    this.type = option.type ?? 'local'
  }

  isAudioActive() {
    return this.audioActive
  }

  isVideoActive() {
    return this.videoActive
  }

  isScreenShareActive() {
    return this.screenShareActive
  }

  getConnectionId() {
    return this.connectionId
  }

  getNickname() {
    return this.nickname
  }

  getStreamManager() {
    return this.streamManager
  }

  isLocal() {
    return this.type === 'local'
  }
  isRemote() {
    return !this.isLocal()
  }
  setAudioActive(isAudioActive: boolean) {
    this.audioActive = isAudioActive
  }
  setVideoActive(isVideoActive: boolean) {
    this.videoActive = isVideoActive
  }
  setScreenShareActive(isScreenShareActive: boolean) {
    this.screenShareActive = isScreenShareActive
  }
  setStreamManager(streamManager: Subscriber | Publisher) {
    this.streamManager = streamManager
  }

  setConnectionId(conecctionId: string) {
    this.connectionId = conecctionId
  }
  setNickname(nickname: string) {
    this.nickname = nickname
  }
  setType(type: 'local' | 'remote') {
    if (type === 'local' || type === 'remote') {
      this.type = type
    }
  }
}

export default UserModel
