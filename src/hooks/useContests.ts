import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { db, getContests, Contest, getCurrentUserDoc } from '~/api'
import { useCurrentUser } from './useCurrentUser'
import { firebase } from '@react-native-firebase/firestore'

export interface ContestsState {
  isLoading: boolean
  contests: Contest[]
  createdContests: Contest[]
  communityContests: Contest[]
  participatingContests: Contest[]
}

export const useContests = create<ContestsState>((set, get) => {
  const initialState: ContestsState = {
    contests: [],
    createdContests: [],
    communityContests: [],
    participatingContests: [],
    isLoading: true,
  }

  const lastContestsSubscription = {
    unsubscribe: () => {},
  }

  auth().onAuthStateChanged(async (currentUser) => {
    if (!currentUser) return

    lastContestsSubscription.unsubscribe()

    lastContestsSubscription.unsubscribe = db.contests.onSnapshot(async () => {
      set({ isLoading: true })

      const contests = await await getContests()

      set({
        isLoading: false,
        contests,
        createdContests: contests.filter((contest) => contest.authorId === currentUser.uid),
        communityContests: contests.filter(
          (contest) =>
            contest.authorId !== currentUser.uid &&
            firebase.firestore.Timestamp.now().toMillis() < contest.endDate.toMillis(),
        ),
        participatingContests: contests.filter((contest) =>
          contest.participatingUsers.some(({ id }) => id === currentUser.uid),
        ),
      })
    })
  })

  return initialState
})
