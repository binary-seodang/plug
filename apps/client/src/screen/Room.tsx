import { useNavigate, useParams } from 'react-router-dom'
import { Welcome } from 'types/dtos/socketResponse.dto'
import useSocket from 'hooks/useSocket'
import { useCallback, useEffect, useRef, useState } from 'react'
import useRTCConnection from 'hooks/useRTCConnection'
import { Socket } from 'socket.io-client'
import { handleIce } from 'libs/fn'
import store from 'store/index'
import { OpenVidu } from 'openvidu-browser'
import useOv from 'hooks/useOv'

const Room = () => {
  const { roomName } = useParams()
  const navigate = useNavigate()
  const test = useOv(roomName!)
  const [joinedUsers, setJoindUsers] = useState<[] | string[]>([])
  const [lastJoinedUser, setLastJoined] = useState<string | null>(null)
  const myVideo = useRef<HTMLVideoElement>(null)

  if (!roomName) {
    return null
  }
  const createPeer = useCallback(async (socket: Socket, stream?: MediaStream) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    })

    stream && stream.getTracks().forEach((track) => peer.addTrack(track, stream))

    // peer.addEventListener('connectionstatechange', (e) => {
    //   console.log(e, '<< == connectionstatechange')
    //   console.log(peer.connectionState, '<< == connectionstatechange')
    // })

    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)

    socket.emit(
      'offer',
      { sdp: offer.sdp, type: offer.type, channelId: roomName },
      async (data) => {
        await peer.setRemoteDescription(
          new RTCSessionDescription({
            type: data.type,
            sdp: data.sdp,
          }),
        )

        peer.addEventListener(
          'icecandidate',
          handleIce({
            peer,
            socket,
            roomName,
            type: 'local',
          }),
        )
      },
    )

    return peer
  }, [])

  const createStreamPeer = useCallback(
    async (payload: { sdp: string; sessionId: string; channelId: string }) => {
      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
              'stun:stun3.l.google.com:19302',
              'stun:stun4.l.google.com:19302',
            ],
          },
        ],
      })

      await peer.setRemoteDescription(
        new RTCSessionDescription({
          type: 'offer',
          sdp: payload.sdp,
        }),
      )
      // peer.addEventListener('connectionstatechange', (e) => {
      //   console.log(e, '<< == connectionstatechange')
      //   console.log(peer.connectionState, '<< == connectionstatechange')
      // })

      const answer = await peer.createAnswer()
      await peer.setLocalDescription(answer)
      peer.addEventListener(
        'icecandidate',
        handleIce({
          peer,
          roomName,
          socket,
          type: 'client',
          fromSessionId: payload.sessionId,
        }),
      )
      socket.emit(
        'answer',
        {
          sdp: answer.sdp,
          type: answer.type,
          channelId: roomName,
          fromSessionId: payload.sessionId,
        },
        (data) => {},
      )
      return peer
    },
    [],
  )

  const onRefreshRoomSetting = useCallback(({ ok, joinedUserNickname, userList }: Welcome) => {
    if (ok && userList) {
      if (joinedUserNickname) {
        setLastJoined(joinedUserNickname)
      }
      setJoindUsers(userList)
    }
  }, [])
  const { socket } = useSocket({
    nsp: '/workspace',
    onConnect(socket) {
      socket.listen('welcome', onRefreshRoomSetting)
      socket.listen('leave_room', onRefreshRoomSetting)
      // socket.listen(
      //   'offer',
      //   async (data: { sdp: string; sessionId: string; channelId: string }) => {
      //     const payload = data

      //     const peer = await createStreamPeer(payload)
      //   },
      // )
    },
    onMounted(socket) {
      if (socket.connected) {
        socket.listen('welcome', onRefreshRoomSetting)
        socket.listen('leave_room', onRefreshRoomSetting)
      }
    },
    onUnmounted(socket) {
      socket.emit('leave_room', roomName)
    },
  })

  const me = store((state) => state.user)
  console.log(me)
  // const { isLoading, stream } = useRTCConnection({
  //   async onConnect(stream) {
  //     await createPeer(socket, stream)
  //   },
  // })
  useEffect(() => {
    socket.emit('join_room', roomName, onRefreshRoomSetting)
  }, [])
  return (
    <div>
      {lastJoinedUser ? <h1>Welcome {lastJoinedUser} ! </h1> : null}
      {joinedUsers.map((item) => (
        <p key={item}>{item}</p>
      ))}

      <video ref={myVideo}>
        <source />
      </video>
    </div>
  )
}

export default Room
