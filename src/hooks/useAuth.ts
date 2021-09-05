import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import create from 'zustand'

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

  return initialState
})
