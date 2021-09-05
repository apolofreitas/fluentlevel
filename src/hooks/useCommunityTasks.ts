import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { db, getCommunityTasks, Task } from '~/api'

export interface CommunityTasksState {
  isLoading: boolean
  communityTasks: Task[]
}

export const useCommunityTasks = create<CommunityTasksState>((set) => {
  const initialState: CommunityTasksState = {
    communityTasks: [],
    isLoading: true,
  }

  const lastCommunityTasksSubscription = {
    unsubscribe: () => {},
  }

  auth().onAuthStateChanged(async (currentUser) => {
    lastCommunityTasksSubscription.unsubscribe()

    if (!currentUser) {
      set({ isLoading: false, communityTasks: initialState.communityTasks })
    } else {
      lastCommunityTasksSubscription.unsubscribe = db.tasks.onSnapshot(async () => {
        set({
          isLoading: false,
          communityTasks: await getCommunityTasks(),
        })
      })
    }
  })
  return initialState
})
