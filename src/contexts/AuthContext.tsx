import { createContext, useState, useEffect } from 'react'

import { firebase, auth } from '../services/firebase'

type AuthContextProviderProps = {
  children: React.ReactNode
}

type AuthContextProps = {
  user: UserProps | undefined
  signInWithGoogle: () => Promise<void>
}

type UserProps = {
  id: string
  name: string
  avatar: string
}

export const AuthContext = createContext({} as AuthContextProps)

export const AuthContextProvider = (props: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserProps>()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }

        setUser({ id: uid, name: displayName, avatar: photoURL })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)
    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.')
      }

      setUser({ id: uid, name: displayName, avatar: photoURL })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}
