import { useQuery } from '@apollo/client'
import { graphql } from 'gql'
import useGetToken from 'hooks/useGetToken'
import { Outlet, useNavigate } from 'react-router-dom'
import { useClearUser } from 'store/action'
import store from 'store/index'

const GET_ME = graphql(/** GraphQl */ `
  query getMe {
    getMe {
      ok
      user {
        id
        nickname
        createdAt
        updatedAt
        role
        sessionId
      }
      error
    }
  }
`)

const SocketLayout = () => {
  const key = import.meta.env.VITE_AUTH_KEY
  const token = localStorage.getItem(key) || ''
  const { setUser, clear } = store((state) => ({
    setUser: state.setUser,
    clear: state.clear,
  }))
  const { data, loading, client } = useQuery(GET_ME, {
    context: {
      headers: {
        [key]: token,
      },
    },
    onCompleted({ getMe: { ok, error, user } }) {
      if (ok && user) {
        console.log(user)
        setUser({ user, token })
      } else {
        clear()
        navigate('/login')
      }
    },
    onError(error) {
      navigate('/login')
    },
    fetchPolicy: 'no-cache',
  })
  const navigate = useNavigate()

  return <div>{loading ? 'loading...' : <Outlet />}</div>
}

export default SocketLayout
