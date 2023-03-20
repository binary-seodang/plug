import { useCallback } from 'react'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { graphql } from 'gql'
import store from 'store/index'

const GET_VIDU_TOKEN = graphql(/** GraphQl */ `
  query getToken($sessionId: String!) {
    getToken(sessionId: $sessionId) {
      ok
      token
    }
  }
`)

const GET_VIDU_SESSION = graphql(/** GraphQl */ `
  query getSession($sessionId: String!) {
    getSession(sessionId: $sessionId) {
      ok
      session {
        sessionId
        createdAt
      }
      error
    }
  }
`)

const GET_VIDU_TOKEN_CONNECTION = graphql(`
  query getTokenConnection($sessionId: String!) {
    getTokenConnection(sessionId: $sessionId) {
      ok
      token
      error
    }
  }
`)

const useGetToken = () => {
  const oAuthToken = store((state) => state.token)

  const [getToken, { data, loading, error }] = useLazyQuery(GET_VIDU_TOKEN_CONNECTION, {
    context: {
      headers: {
        [import.meta.env.VITE_AUTH_KEY]: oAuthToken,
      },
    },
    onCompleted(data) {
      console.log(data, '<<token')
    },
    onError(error) {
      console.log(error, ' <??')
    },
  })

  return { getToken, loading, token: data?.getTokenConnection.token, error }
}

export default useGetToken
