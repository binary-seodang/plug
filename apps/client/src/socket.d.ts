import type { Socket as S } from 'socket.io-client'
declare module 'socket.io-client' {
  interface Socket extends S {
    listen<Ev extends string>(
      ev: Ev,
      listener: FallbackToUntypedListener<
        Ev extends 'connect' | 'connect_error' | 'disconnect'
          ? SocketReservedEvents[Ev]
          : Ev extends string
          ? (...args: any[]) => void
          : never
      >,
    ): this

    publicId: string
  }
}
