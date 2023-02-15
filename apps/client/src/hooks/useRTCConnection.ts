import { useCallback, useEffect, useRef, useState } from 'react'
interface RTCConnection {
  isLoading: boolean
  stream: MediaStream | null
  isError: boolean
}

interface RTCConnectionProps {
  onConnect?: (stream: MediaStream) => void
}

const useRTCConnection = ({ onConnect }: RTCConnectionProps = {}) => {
  const returnValue = useRef<RTCConnection>({
    isLoading: true,
    stream: null,
    isError: false,
  })
  const getConenction = useCallback(async () => {
    const mediaSource = {
      ...returnValue.current,
    }
    try {
      mediaSource.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      onConnect && onConnect(mediaSource.stream)
    } catch (err) {
      console.log(err)
      mediaSource.isError = true
    }
    returnValue.current = {
      ...mediaSource,
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
