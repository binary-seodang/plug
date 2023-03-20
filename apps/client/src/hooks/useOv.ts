import UserModel from 'model/UserModel'
import { Device, OpenVidu, Session, SignalOptions } from 'openvidu-browser'
import { useCallback, useEffect, useRef, useState } from 'react'
import useGetToken from './useGetToken'

interface DeserializeSignal {
  isAudioActive: boolean
  isVideoActive: boolean
  nickname: string
  isScreenShareActive: boolean
}

const useOv = (roomName: string) => {
  const [session, setSession] = useState<Session>()
  const [subscribers, setSubscriber] = useState<UserModel[]>([])
  const [localUserAccessAllowed, setLocalUserAccessAllowed] = useState(false)
  const [localUser, setLocalUser] = useState(new UserModel())
  const currentVideoDevice = useRef<Device>()
  const { getToken, token } = useGetToken()
  const ov = useRef(new OpenVidu()).current

  const joinSession = useCallback(() => {
    setSession(() => ov.initSession())
  }, [])

  const checkSomeoneShareScreen = useCallback(() => {
    let isScreenShared =
      subscribers.some((user) => user.isScreenShareActive()) || localUser.isScreenShareActive()
  }, [subscribers, localUser])

  const sendSignalUserChanged = useCallback(
    (data: Partial<DeserializeSignal>) => {
      if (session) {
        const signalOptions = {
          data: JSON.stringify(data),
          type: 'userChanged',
        }
        session?.signal(signalOptions)
      }
    },
    [session],
  )

  const updateSubscribers = useCallback(() => {
    if (localUser) {
    }
  }, [])

  const subscribeToStreamCreated = useCallback(() => {
    if (session) {
      session.on('streamCreated', (event) => {
        const subscriber = session.subscribe(event.stream, undefined)
        subscriber.on('streamPlaying', (event) => {
          checkSomeoneShareScreen()
          // 커스텀 클래스 추가
          // subscriber.videos[0].video.parentElement
        })
        const newUser = new UserModel()
        newUser.setStreamManager(subscriber)
        newUser.setConnectionId(event.stream.connection.connectionId)
        newUser.setType('remote')
        const nickname = event.stream.connection.data.split('%')[0]
        newUser.setNickname(JSON.parse(nickname).clientData)
        setSubscriber((prev) => [...prev, newUser])
        if (localUserAccessAllowed) {
          updateSubscribers()
        }
      })
      // const sub = session?.subscribe()
    }
  }, [session])

  const subscribeToUserChanged = useCallback(() => {
    if (session) {
      session.on('signal:userChanged', (event) => {
        const newRemoteSubscribers = [...subscribers]
        newRemoteSubscribers.forEach((user) => {
          if (user.getConnectionId() === event.from?.connectionId) {
            const data = JSON.parse(event?.data ?? '')
            console.log('EVENTO REMOTE: ', event.data)
            if (data.isAudioActive) {
              user.setAudioActive(data.isAudioActive)
            }
            if (data.isVideoActive !== undefined) {
              user.setVideoActive(data.isVideoActive)
            }
            if (data.nickname !== undefined) {
              user.setNickname(data.nickname)
            }
            if (data.isScreenShareActive !== undefined) {
              user.setScreenShareActive(data.isScreenShareActive)
            }
          }
        })
        setSubscriber(() => newRemoteSubscribers)
      })
    }
  }, [])
  const deleteSubscriber = (stream) => {
    const remoteUsers = [...subscribers]
    const userStream =
      remoteUsers.filter((user) => user.getStreamManager()?.stream === stream)[0] || []
    let index = remoteUsers.indexOf(userStream, 0)
    if (index > -1) {
      remoteUsers.splice(index, 1)
      setSubscriber(() => remoteUsers)
    }
  }

  const subscribeToStreamDestroyed = () => {
    if (session) {
      session.on('streamDestroyed', (event) => {
        event.preventDefault()
        deleteSubscriber(event.stream)
      })
    }
  }

  const connectWebCam = useCallback(async () => {
    if (session) {
      await ov.getUserMedia({ audioSource: undefined, videoSource: undefined })
      var devices = await ov.getDevices()
      var videoDevices = devices.filter((device) => device.kind === 'videoinput')

      let publisher = ov.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: videoDevices[0].deviceId,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
      })

      if (session?.capabilities.publish) {
        publisher.on('accessAllowed', () => {
          session.publish(publisher).then(() => {
            updateSubscribers()
            setLocalUserAccessAllowed(true)
            // if (this.props.joinSession) {
            //   this.props.joinSession()
            // }
          })
        })
      }
      // publisher.on('streamPlaying', (e) => {
      //   publisher.videos[0].video.parentElement
      // })
      // localUser.setNickname(this.state.myUserName)
      localUser.setConnectionId(session.connection.connectionId)
      localUser.setScreenShareActive(false)
      localUser.setStreamManager(publisher)
      console.log(localUser, 'changed')
      subscribeToUserChanged()
      subscribeToStreamDestroyed()
      sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() })
      currentVideoDevice.current = videoDevices[0]
    }
  }, [session])
  const connect = useCallback(
    (token: string) => {
      console.log('connection call')
      if (session) {
        session
          .connect(token, { clientData: localUser.getNickname() })
          .then(() => {
            console.log('connection done')
            connectWebCam()
          })
          .catch((error: any) => {
            console.log('There was an error connecting to the session:', error.code, error.message)
          })
      }
    },
    [session],
  )

  const connectToSession = useCallback(async () => {
    if (session) {
      if (token) {
        connect(token)
      } else {
        try {
          console.log('START!!', roomName)
          getToken({
            variables: {
              sessionId: roomName,
            },
          })
        } catch (error: any) {
          console.error('There was an error getting the token:', error.code, error.message)
        }
      }
    }
  }, [token, session])

  useEffect(() => {
    if (token) {
      connect(token)
    }
  }, [token])

  useEffect(() => {
    joinSession()
  }, [])

  useEffect(() => {
    if (session) {
      subscribeToStreamCreated()
      connectToSession()
    }
  }, [session])

  return {
    localUser,
    subscribers,
  }
}

export default useOv
