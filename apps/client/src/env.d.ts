declare namespace NodeJS {
  interface Process {
    env: ProcessEnv
  }

  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly VITE_SERVER_URL: string
    readonly VITE_SOCKET_SERVER_URL: string
    readonly VITE_SOCKET_SERVER_PORT: string
    readonly VITE_AUTH_KEY: string
    readonly [key: string]: string
  }
}
