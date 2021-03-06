import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

const { SNOWPACK_PUBLIC_API_URL } = import.meta.env

// Tailwind
import 'tailwindcss/dist/tailwind.css'

// Apollo GraphQL Client
const client = new ApolloClient({
  uri: SNOWPACK_PUBLIC_API_URL,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}
