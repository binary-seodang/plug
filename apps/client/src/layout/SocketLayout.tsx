import { gql, useQuery } from '@apollo/client'
import { Outlet, useNavigate } from 'react-router-dom'
import { useClearUser } from 'store/action'
import store from 'store/index'
import { GetMeQuery } from '__api__/types'

const GET_ME = gql`
  query getMe {
    getMe {
      ok
      user {
        id
        nickname
        createdAt
        updatedAt
        role
      }
      error
    }
  }
`

const SocketLayout = () => {
  const key = import.meta.env.VITE_AUTH_KEY
  const token = localStorage.getItem(key) || ''

  const { setUser, clear } = store((state) => ({
    setUser: state.setUser,
    clear: state.clear,
  }))
  const { data, loading, client } = useQuery<GetMeQuery>(GET_ME, {
    context: {
      headers: {
        [key]: token,
      },
    },
    onCompleted({ getMe: { ok, error, user } }) {
      if (ok && user) {
        setUser({ user, token })
      } else {
        clear()
        navigate('/login')
      }
    },
    fetchPolicy: 'no-cache',
  })

  const navigate = useNavigate()

  return <div>{loading ? 'loading...' : <Outlet />}</div>
}

export default SocketLayout
