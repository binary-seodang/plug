// import useSocket from 'hooks/useSocket'
import { useNavigate, useParams } from 'react-router-dom'
import { Welcome } from 'types/dtos/socketResponse.dto'
import useSocket from 'hooks/useSocket'
import { useCallback, useEffect, useRef, useState } from 'react'
import useRTCConnection from 'hooks/useRTCConnection'

const Room = () => {
  const { roomName } = useParams()
  const navigate = useNavigate()
  const [joinedUsers, setJoindUsers] = useState<[] | string[]>([])
  const [lastJoinedUser, setLastJoined] = useState<string | null>(null)
  const myVideo = useRef<HTMLVideoElement>(null)

  const createPeer = useCallback(async (stream?: MediaStream) => {
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
    // const peer = new Peer({ initiator: true })

    stream && stream.getTracks().forEach((track) => peer.addTrack(track, stream))

    peer.addEventListener('connectionstatechange', (e) => {
      console.log(e, '<< == connectionstatechange')
      console.log(peer.connectionState, '<< == connectionstatechange')
    })

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
        peer.addEventListener('icecandidate', async (e) => {
          if (!e.candidate) return
          socket.emit('add-ice', { candidate: e.candidate, type: e.type, channelId: roomName })
          socket.listen('icecandidate', (data) => {
            const payload: RTCIceCandidate = JSON.parse(data.candidate)
            console.log(data, 'ICE SOCKET RECEIVE')
            console.log(payload, 'socket:  icecandidate')
            peer.addIceCandidate(payload)
          })
        })
      },
    )
    return peer
  }, [])

  const createStreamPeer = useCallback(async (sdp: string) => {
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
        sdp,
      }),
    )
    peer.addEventListener('connectionstatechange', (e) => {
      console.log(e, '<< == connectionstatechange')
      console.log(peer.connectionState, '<< == connectionstatechange')
    })

    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)
    peer.addEventListener('icecandidate', async (e) => {
      console.log('create stream peer : icecandidate ', e)
      if (!e.candidate) return
      socket.emit('add-client-ice', {
        candidate: e.candidate,
        type: 'clientIce',
        channelId: roomName,
      })
      socket.listen('client-icecandidate', (data) => {
        const payload: RTCIceCandidate = JSON.parse(data.candidate)
        console.log(data, 'ICE SOCKET RECEIVE')
        console.log(payload, 'socket:  icecandidate')
        peer.addIceCandidate(payload)
      })
    })
    socket.emit('answer', { sdp: answer.sdp, type: answer.type, channelId: roomName })
    return peer
  }, [])

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
      socket.listen('offer', async (data: any) => {
        const payload = data
        const peer = await createStreamPeer(payload.sdp)
        console.log('create STREAM PEER : ', peer)
      })
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
  const { isLoading, stream } = useRTCConnection({
    async onConnect(stream) {
      await createPeer(stream)
    },
  })
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
