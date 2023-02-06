import { create } from 'zustand'
import { devtools, subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware'
import { User } from '__api__/types'

interface IStore {
  user: User | null
  token: null | string
  setUser: ({ user, token }: { user: User; token: string }) => void
  clear: () => void
}

const store = create(
  devtools(
    persist(
      subscribeWithSelector<IStore>((set, get) => ({
        user: null,
        token: null,
        setUser: ({ user, token }) => {
          localStorage.setItem('_PLUG_AUTH_', token)
          set((state) => ({ ...state, user, token }))
        },
        clear: () => {
          localStorage.removeItem(import.meta.env.VITE_AUTH_KEY)
          set({ user: null, token: null })
        },
      })),
      {
        name: 'plug-storage',
        storage: createJSONStorage(() => localStorage),
        version: 1,
      },
    ),
    {
      enabled: import.meta.env.NODE_ENV !== 'production',
    },
  ),
)

export default store
