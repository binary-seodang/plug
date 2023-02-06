import useSocket from 'hooks/useSocket'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import store from 'store/index'

interface JoinRoomInput {
  roomName: string
}
interface NicknameInput {
  nickname: string
}

const Home = () => {
  const { socket } = useSocket({ nsp: '/' })
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<string[] | []>([])
  const user = store((state) => state.user)
  const { register: roomRegister, handleSubmit: roomSubmit } = useForm<JoinRoomInput>()
  const { register: nicknameRegister, handleSubmit: nicknameSubmit } = useForm<NicknameInput>({
    defaultValues: {
      nickname: user?.nickname,
    },
  })

  const onJoinRoom = useCallback(
    ({ roomName }: JoinRoomInput) => {
      navigate(roomName)
    },
    [socket?.on],
  )

  const onSetNickname = useCallback(
    ({ nickname }: NicknameInput) => {
      socket?.emit('set_nickname', nickname, (nickname: string) => {
        if (nickname) {
          localStorage.setItem('plug_nickname', nickname)
        } else {
          // TODO
        }
      })
    },
    [socket?.on],
  )
  useEffect(() => {
    if (socket) {
      socket.listen('room_change', (data: any) => {
        setRooms(data)
      })
    }
  }, [rooms, setRooms])
  return (
    <>
      <form onSubmit={nicknameSubmit(onSetNickname)}>
        <input
          placeholder='닉네임을 설정해주세요'
          {...nicknameRegister('nickname', {
            required: '필수',
          })}
        />
        <input type='submit' value='submit' />
      </form>
      <form onSubmit={roomSubmit(onJoinRoom)}>
        <input
          {...roomRegister('roomName', {
            required: '필수',
          })}
        />
        <input type='submit' value='join' />
      </form>
      <section>
        {rooms.length ? (
          <ul>
            {rooms.map((room) => (
              <li key={room} onClick={() => onJoinRoom({ roomName: room })}>
                {room}
              </li>
            ))}
          </ul>
        ) : (
          <>Not found.</>
        )}
      </section>
    </>
  )
}

export default Home
