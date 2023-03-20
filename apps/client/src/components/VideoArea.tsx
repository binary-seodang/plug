import UserModel from 'model/UserModel'
import React, { FC, useEffect, useRef } from 'react'

interface VideoAreaProps {
  user: UserModel
}

const VideoArea: FC<VideoAreaProps> = ({ user }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (user.getStreamManager()) {
      user.getStreamManager()?.addVideoElement(videoRef.current!)
    }
  }, [user])
  return (
    <div>
      <video ref={videoRef} autoPlay>
        <source />
      </video>
    </div>
  )
}

export default VideoArea
