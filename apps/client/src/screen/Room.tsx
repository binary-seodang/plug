// import useSocket from 'hooks/useSocket'
import { useNavigate, useParams } from 'react-router-dom'
import { Welcome } from 'types/dtos/socketResponse.dto'
import useSocket from 'hooks/useSocket'
import { useCallback, useEffect, useState } from 'react'
import useRTCConnection from 'hooks/useRTCConnection'

const Room = () => {
  const { roomName } = useParams()
  const navigate = useNavigate()
  const [joinedUsers, setJoindUsers] = useState<[] | string[]>([])
  const [lastJoinedUser, setLastJoined] = useState<string | null>(null)
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
      socket.emit('join_room', roomName, onRefreshRoomSetting)
    },
    onUnmounted(socket) {
      socket.emit('leave_room', roomName)
    },
  })
  const { isLoading, stream } = useRTCConnection({
    onConnect(stream) {
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
      peer.addEventListener('icecandidate', (e) => {
        if (!(e.candidate && socket)) return
        console.log('sender Cadidate')
        socket.emit('sender-cadidate', {
          candidate: e.candidate,
          senderId: socket.id,
        })
      })
      peer.addEventListener('iceconnectionstatechange', (e) => {
        console.log(e)
      })

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream)
      })
      socket.emit('stream', stream.id)
    },
  })
  return (
    <div>
      {lastJoinedUser ? <h1>Welcome {lastJoinedUser} ! </h1> : null}
      {joinedUsers.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  )
}

export default Room
