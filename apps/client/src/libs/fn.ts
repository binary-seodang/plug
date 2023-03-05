import { Socket } from 'socket.io-client'

type HandleIce = (
  payload:
    | {
        peer: RTCPeerConnection
        socket: Socket
        roomName: string
        type: 'local'
      }
    | {
        peer: RTCPeerConnection
        socket: Socket
        roomName: string
        type: 'client'
        fromSessionId: string
      },
) => (iceEvent: RTCPeerConnectionIceEvent) => Promise<void>
const handleIce: HandleIce = (payload) => async (iceEvent: RTCPeerConnectionIceEvent) => {
  const { peer, roomName, type, socket } = payload
  const isLocal = type === 'local'
  const emitKey = isLocal ? 'add-ice' : 'add-client-ice'
  const listenKey = isLocal ? 'icecandidate' : 'client-icecandidate'
  if (!iceEvent.candidate) return
  const emitPayload = {
    candidate: iceEvent.candidate,
    type: isLocal ? iceEvent.type : 'clientIce',
    channelId: roomName,
    fromSessionId: isLocal ? '' : payload.fromSessionId,
  }
  socket.emit(emitKey, emitPayload)
  socket.listen(listenKey, (data) => {
    const payload: RTCIceCandidate = JSON.parse(data.candidate)
    peer.addIceCandidate(payload)
  })
}

export { handleIce }
