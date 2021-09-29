import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import create from 'zustand'

import { db } from '~/api'

interface AuthState {
  isLoading: boolean
  isSignedIn: boolean
  currentUser: FirebaseAuthTypes.User | null
}

export const useAuth = create<AuthState>((set) => {
  const initialState = {
    isLoading: true,
    isSignedIn: false,
    currentUser: null,
  }

  auth().onAuthStateChanged((user) => {
    set({ isLoading: false, isSignedIn: !!user, currentUser: user })
  })

  auth().onUserChanged((user) => {
    if (!user) return
    db.users.doc(user.uid).update({
      email: user.email || '',
    })
  })

  return initialState
})
