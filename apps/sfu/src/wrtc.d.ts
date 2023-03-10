declare module 'wrtc' {
  export const RTCPeerConnection: {
    prototype: RTCPeerConnection
    new (configuration?: RTCConfiguration): RTCPeerConnection
    generateCertificate(
      keygenAlgorithm: AlgorithmIdentifier,
    ): Promise<RTCCertificate>
    getDefaultIceServers(): RTCIceServer[]
  }
  export const MediaStream: {
    prototype: MediaStream
    new (): MediaStream
    new (stream: MediaStream): MediaStream
    new (tracks: MediaStreamTrack[]): MediaStream
  }

  interface RTCIceCandidate {
    readonly candidate: string
    readonly component: RTCIceComponent | null
    readonly foundation: string | null
    readonly port: number | null
    readonly priority: number | null
    readonly protocol: RTCIceProtocol | null
    readonly relatedAddress: string | null
    readonly relatedPort: number | null
    readonly sdpMLineIndex: number | null
    readonly sdpMid: string | null
    readonly tcpType: RTCIceTcpCandidateType | null
    readonly type: RTCIceCandidateType | null
    readonly usernameFragment: string | null
    toJSON(): RTCIceCandidateInit
  }

  export const RTCIceCandidate: {
    prototype: RTCIceCandidate
    new (candidateInitDict?: RTCIceCandidateInit): RTCIceCandidate
  }

  interface RTCSessionDescription {
    readonly sdp: string
    readonly type: RTCSdpType
    toJSON(): any
  }

  export const RTCSessionDescription: {
    prototype: RTCSessionDescription
    new (descriptionInitDict: RTCSessionDescriptionInit): RTCSessionDescription
  }
}
