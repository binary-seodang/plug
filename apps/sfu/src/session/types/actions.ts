export type dispatchActionType =
  | 'offer'
  | 'icecandidate'
  | 'client-icecandidate'
export type dispatchArgs =
  | { type: 'offer'; sdp: string; sessionId: string; channelId: string }
  | {
      type: 'icecandidate'
      sessionId: string
      channelId: string
      candidate: string
    }
  | {
      type: 'client-icecandidate'
      sessionId: string
      channelId: string
      candidate: string
    }
export type dispatch = (args: dispatchArgs) => void

export type Dispatch = (args: dispatchArgs) => void
