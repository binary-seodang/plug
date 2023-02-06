import { ApolloProvider } from '@apollo/client/react'
import { client } from './apollo'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from './router/Routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  </React.StrictMode>,
)
