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

      stream.getTracks().forEach((track) => peer.addTrack(track, stream))

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
          await peer.setRemoteDescription({ type: data.type, sdp: data.sdp })
          peer.addEventListener('icecandidate', async (e) => {
            console.log(e)
            if (!e.candidate) return
            console.log(e)
            socket.emit('add-ice', { candidate: e.candidate, type: e.type, channelId: roomName })
            socket.listen('icecandidate', (data) => {
              const payload: RTCIceCandidate = JSON.parse(data)
              peer.addIceCandidate(payload)

              // socket.listen('offer', async (data) => {
              // await peer.setRemoteDescription(data.sdp)
              // const answer = await peer.createAnswer()
              // await peer.setLocalDescription(answer)
              // })
            })
          })
          // peer.addEventListener('icecandidate', async (e) => {
          //   if (!e.candidate) return
          //   socket.emit('add-ice', { candidate: e.candidate, type: e.type, channelId: roomName })
          //   socket.on('icecandidate', (data) => {
          //     const payload: RTCIceCandidate = JSON.parse(data)
          //     peer.addIceCandidate(payload)
          //     peer.addEventListener('track', (e) => {
          //       console.log(e)
          //     })

          //     // socket.on('offer', async (data) => {
          //     //   await peer.setRemoteDescription(data.sdp)
          //     //   // const answer = await peer.createAnswer()
          //     //   // await peer.setLocalDescription(answer)
          //     // })
          //   })
          // })
        },
      )
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
