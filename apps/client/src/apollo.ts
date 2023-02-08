import { ApolloClient } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'

export const client = new ApolloClient({
  // uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
  uri: `http://localhost:4337/graphql`,
  cache: new InMemoryCache(),
})
