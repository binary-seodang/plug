import { Socket } from 'socket.io-client'

const handleIce =
  ({
    peer,
    roomName,
    socket,
    type,
  }: {
    peer: RTCPeerConnection
    socket: Socket
    roomName: string
    type: 'local' | 'client'
  }) =>
  async (iceEvent: RTCPeerConnectionIceEvent) => {
    const isLocal = type === 'local'
    const emitKey = isLocal ? 'add-ice' : 'add-client-ice'
    const listenKey = isLocal ? 'icecandidate' : 'client-icecandidate'
    if (!iceEvent.candidate) return
    socket.emit(emitKey, {
      candidate: iceEvent.candidate,
      type: isLocal ? iceEvent.type : 'clientIce',
      channelId: roomName,
    })
    socket.listen(listenKey, (data) => {
      const payload: RTCIceCandidate = JSON.parse(data.candidate)
      peer.addIceCandidate(payload)
    })
  }

export { handleIce }
