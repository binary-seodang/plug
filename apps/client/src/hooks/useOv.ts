import UserModel from 'model/UserModel'
import { OpenVidu, Session, SignalOptions } from 'openvidu-browser'
import { useCallback, useEffect, useRef, useState } from 'react'
import useGetToken from './useGetToken'

const useOv = (roomName: string) => {
  const [session, setSession] = useState<Session>()
  const [subscribers, setSubscriber] = useState<UserModel[]>([])
  const [localUserAccessAllowed, setLocalUserAccessAllowed] = useState(false)
  const localUser = useRef(new UserModel()).current
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
    (data: SignalOptions) => {
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
      // localUser.setNickname(this.state.myUserName)
      localUser.setConnectionId(session.connection.connectionId)
      localUser.setScreenShareActive(false)
      localUser.setStreamManager(publisher)
      // this.subscribeToUserChanged()
      // this.subscribeToStreamDestroyed()
      // this.sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() })

      // this.setState({ currentVideoDevice: videoDevices[0], localUser: localUser }, () => {
      //   this.state.localUser.getStreamManager().on('streamPlaying', (e) => {
      //     this.updateLayout()
      //     publisher.videos[0].video.parentElement.classList.remove('custom-class')
      //   })
      // })
    }
  }, [])
  const connect = useCallback((token: string) => {
    if (session) {
      session
        .connect(token, { clientData: localUser.getNickname() })
        .then(() => {
          connectWebCam()
        })
        .catch((error: any) => {
          console.log('There was an error connecting to the session:', error.code, error.message)
        })
    }
  }, [])

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
    joinSession()
  }, [])

  useEffect(() => {
    if (session) {
      subscribeToStreamCreated()
      connectToSession()
    }
  }, [session])

  return
}

export default useOv
