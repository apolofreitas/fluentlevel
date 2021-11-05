import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { db, getContests, Contest } from '~/api'

export interface ContestsState {
  isLoading: boolean
  contests: Contest[]
  createdContests: Contest[]
  communityContests: Contest[]
}

export const useContests = create<ContestsState>((set) => {
  const initialState: ContestsState = {
    contests: [],
    createdContests: [],
    communityContests: [],
    isLoading: true,
  }

  const lastContestsSubscription = {
    unsubscribe: () => {},
  }

  auth().onAuthStateChanged(async (currentUser) => {
    lastContestsSubscription.unsubscribe()

    if (!currentUser) {
      set({ isLoading: false, createdContests: initialState.createdContests })
    } else {
      lastContestsSubscription.unsubscribe = db.contests.onSnapshot(async () => {
        const contests = await getContests()

        set({
          isLoading: false,
          contests,
          createdContests: contests.filter((contest) => contest.authorId === currentUser.uid),
          communityContests: contests.filter((contest) => contest.authorId !== currentUser.uid),
        })
      })
    }
  })

  return initialState
})
