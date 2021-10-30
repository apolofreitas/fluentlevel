import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { db, getUsers, UserModel } from '~/api'

export interface UsersState {
  isLoading: boolean
  users: UserModel[]
}

export const useUsers = create<UsersState>((set) => {
  const initialState: UsersState = {
    users: [],
    isLoading: true,
  }

  const lastUsersSubscription = {
    unsubscribe: () => {},
  }

  auth().onAuthStateChanged(async (currentUser) => {
    lastUsersSubscription.unsubscribe()

    if (!currentUser) {
      set({ isLoading: false, users: initialState.users })
    } else {
      lastUsersSubscription.unsubscribe = db.users.onSnapshot(async () => {
        set({
          isLoading: false,
          users: await getUsers(),
        })
      })
    }
  })
  return initialState
})
