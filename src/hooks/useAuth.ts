import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import create from 'zustand'

interface AuthState {
  isInitializing: boolean
  isSignedIn: boolean
  currentUser: FirebaseAuthTypes.User | null
}

export const useAuth = create<AuthState>((set) => {
  const initialState = {
    isInitializing: true,
    isSignedIn: false,
    currentUser: null,
  }

  auth().onAuthStateChanged((user) => {
    set({ isInitializing: false, isSignedIn: !!user, currentUser: user })
  })

  return initialState
})
