import { RTCPeerConnection, MediaStream, RTCIceCandidate } from 'wrtc'
import Channel from 'session/channel'
import { Dispatch } from './types/actions'

const config: RTCConfiguration = {
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
}

export class Connection {
  channel: Channel | null = null
  peerConnection: RTCPeerConnection | null = null
  stream: MediaStream | null = null
  outputPeerConnections = new Map<string, RTCPeerConnection>()
  outputPeerCandidateQueue = new Map<string, RTCIceCandidate[]>()
  isConnected = false

  constructor(public id: string, protected dispatch: Dispatch) {}

  addChannel(channel: Channel) {
    this.channel = channel
  }

  async call(connection: Connection) {
    const { stream } = connection
    console.log('??????????????????????????????????')
    //
    if (!stream) return

    const peer = new RTCPeerConnection(config)

    this.outputPeerConnections.set(connection.id, peer)
    peer.addEventListener('icecandidate', (e) => {
      if (!e.candidate) return

      this.dispatch({
        type: 'icecandidate',
        sessionId: this.id,
        candidate: JSON.stringify(e.candidate),
        channelId: this.channel.id,
      })
    })

    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream)
    })

    const offer = await peer.createOffer()
    peer.setLocalDescription(offer)
    this.dispatch({
      type: 'offer',
      sdp: offer.sdp,
      sessionId: this.id,
      channelId: this.channel.id,
    })
  }

  async receiveCall(sdp: string) {
    const peer = new RTCPeerConnection(config)
    this.peerConnection = peer
    peer.addEventListener('track', (e) => {
      console.log(this.outputPeerConnections, ' << track')
      const stream = e.streams[0]
      this.stream = stream
      stream.getTracks().forEach((stream) => console.log(stream))
      // console.log(, 'get stream')
    })

    await peer.setRemoteDescription({
      type: 'offer',
      sdp,
    })
    peer.addEventListener('icecandidate', (e) => {
      if (!e.candidate) return

      setTimeout(() => {
        if (this.dispatch) {
          this.dispatch({
            type: 'icecandidate',
            sessionId: this.id,
            channelId: this.channel.id,
            candidate: JSON.stringify(e.candidate),
          })
        }
      }, 50)
    })

    peer.addEventListener('connectionstatechange', (e) => {
      console.log(
        peer.connectionState,
        'peer.connectionState',
        this.isConnected,
      )
      if (peer.connectionState === 'connected' && !this.isConnected) {
        console.log(peer.connectionState === 'connected' && !this.isConnected)
        this.isConnected = true
        console.log(this.channel)
        const connections = this.channel.getConnectionsExcept(this.id)
        console.log(connections, 'connections')
        connections.forEach((connection) => this.call(connection))
        connections.forEach((connection) => connection.call(this))
      } else if (peer.connectionState === 'failed' && this.isConnected) {
        this.dispose()
      }
    })

    const answer = await peer.createAnswer()
    peer.setLocalDescription(answer)
    return answer
  }

  dispose() {
    this.isConnected = false
    this.peerConnection?.close()
    this.outputPeerConnections.forEach((peer) => peer.close())
    this.channel?.removeConnection(this)
    console.log('I am disposed...')
  }

  async receiveAnswer(sessionId: string, sdp: string) {
    const outputPeer = this.outputPeerConnections.get(sessionId)
    if (!outputPeer) return

    await outputPeer.setRemoteDescription({
      type: 'answer',
      sdp,
    })

    const queue = this.outputPeerCandidateQueue.get(sessionId) ?? []
    if (queue.length > 0) {
      queue.forEach((candidate) => {
        outputPeer.addIceCandidate(candidate)
      })
    }
  }

  addIceCandidate(candidate: any) {
    if (!this.peerConnection || !candidate) return
    this.peerConnection.addIceCandidate(candidate)
  }

  addIceCandidateForOutputPeer(sessionId: string, candidate: any) {
    if (!candidate) return
    const outputPeer = this.outputPeerConnections.get(sessionId)
    if (!outputPeer) return
    const queue = this.outputPeerCandidateQueue.get(sessionId) ?? []
    if (!outputPeer.remoteDescription) {
      queue.push(candidate)
      this.outputPeerCandidateQueue.set(sessionId, queue)
    } else {
      outputPeer.addIceCandidate(candidate)
    }
  }

  removeFromOutputConnections(id: string) {
    const peer = this.outputPeerConnections.get(id)
    peer?.close()
    this.outputPeerConnections.delete(id)
  }
}
