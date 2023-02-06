import { ApolloClient } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'

export const client = new ApolloClient({
  uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
  cache: new InMemoryCache(),
})
