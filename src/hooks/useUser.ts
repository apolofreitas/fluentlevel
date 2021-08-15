import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { User, users } from '~/services/db'

interface UserState extends User {}

export const useUser = create<UserState>((set) => {
  const initialState: UserState = {
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
  }

  const lastUserSubscription = {
    unsubscribe: () => {},
  }

  auth().onAuthStateChanged(async (currentUser) => {
    lastUserSubscription.unsubscribe()

    if (!currentUser) {
      set(initialState)
    } else {
      lastUserSubscription.unsubscribe = await users.doc(currentUser.uid).onSnapshot((doc) => {
        const userData = doc.data()

        if (!userData) return

        set(userData)
      })
    }
  })

  return initialState
})
