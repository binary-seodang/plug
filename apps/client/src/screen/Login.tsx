import { gql, useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import store from 'store'
import { LoginMutation, LoginMutationVariables } from '__api__/types'

interface LoginInput {
  nickname: string
}

const LOGIN_MUTATION = gql`
  mutation login($LoginInput: LoginInput!) {
    login(input: $LoginInput) {
      ok
      token
      error
      user {
        id
        nickname
        updatedAt
        createdAt
        role
      }
    }
  }
`

const Login = () => {
  const [setUser] = store((state) => [state.setUser])
  const { register, handleSubmit } = useForm<LoginInput>()
  const navigate = useNavigate()
  const onCompleted = (data: LoginMutation) => {
    console.log(data)
    const {
      login: { error, ok, token, user },
    } = data
    if (ok && user && token) {
      setUser({ user, token })
      localStorage.setItem(import.meta.env.VITE_AUTH_KEY, token)
      navigate('/')
    }
  }
  const [login] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
    onCompleted,
  })
  const onSetNickname = useCallback(({ nickname }: LoginInput) => {
    login({
      variables: {
        LoginInput: {
          nickname,
        },
      },
    })
  }, [])
  return (
    <div>
      <form onSubmit={handleSubmit(onSetNickname)}>
        <input {...register('nickname')} placeholder='Your nickname here' />
        <input type='submit' value='submit' />
      </form>
    </div>
  )
}

export default Login
