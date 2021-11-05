import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { db, getUserData, User } from '~/api'

export interface CurrentUserState {
  isLoading: boolean
  currentUser: User
}

export const useCurrentUser = create<CurrentUserState>((set, get) => {
  const initialState: CurrentUserState = {
    isLoading: true,
    currentUser: {
      id: '',
      username: '',
      email: '',
      bio: '',
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
      lastUserSubscription.unsubscribe = await db.users.doc(currentUser.uid).onSnapshot(async () => {
        const { user } = await getUserData(db.users.doc(currentUser.uid))
        set({ isLoading: false, currentUser: user })
      })
    }
  })

  return initialState
})
