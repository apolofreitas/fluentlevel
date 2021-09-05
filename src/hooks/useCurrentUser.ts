import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { db, UserModel } from '~/api'

export interface UsersState {
  isLoading: boolean
  currentUser: UserModel
}

export const useCurrentUser = create<UsersState>((set) => {
  const initialState: UsersState = {
    isLoading: true,
    currentUser: {
      username: '',
      email: '',
      nickname: '',
      following: [],
      followers: [],

      tasksScore: 0,
      createdTasks: [],
      tasksHistory: [],

      contestsScore: 0,
      createdContests: [],
      contestsHistory: [],
    },
  }

  const lastUserSubscription = {
    unsubscribe: () => {},
  }

  auth().onAuthStateChanged(async (currentUser) => {
    lastUserSubscription.unsubscribe()

    if (!currentUser) {
      set({ isLoading: false, currentUser: initialState.currentUser })
    } else {
      lastUserSubscription.unsubscribe = await db.users.doc(currentUser.uid).onSnapshot((doc) => {
        const userData = doc.data()
        if (!userData) return
        set({ isLoading: false, currentUser: userData })
      })
    }
  })

  return initialState
})
