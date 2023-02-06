import { useCallback, useEffect, useRef, useState } from 'react'
interface RTCConnection {
  isLoading: boolean
  stream: MediaStream | null
}

interface RTCConnectionProps {
  onConnect?: (stream: MediaStream) => void
}

const useRTCConnection = ({ onConnect }: RTCConnectionProps = {}) => {
  const returnValue = useRef<RTCConnection>({
    isLoading: true,
    stream: null,
  })
  const getConenction = useCallback(async () => {
    let stream = null
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      onConnect && onConnect(stream)
    } catch (err) {
      returnValue.current = {
        stream,
        isLoading: false,
      }
    }
  }, [])

  useEffect(() => {
    getConenction()
  }, [])
  return {
    ...returnValue.current,
  }
}

export default useRTCConnection
