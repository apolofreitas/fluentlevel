import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { db, getCreatedTasks, Task } from '~/api'

export interface CreatedTasksState {
  isLoading: boolean
  createdTasks: Task[]
}

export const useCreatedTasks = create<CreatedTasksState>((set) => {
  const initialState: CreatedTasksState = {
    createdTasks: [],
    isLoading: true,
  }

  const lastCreatedTasksSubscription = {
    unsubscribe: () => {},
  }

  auth().onAuthStateChanged(async (currentUser) => {
    lastCreatedTasksSubscription.unsubscribe()

    if (!currentUser) {
      set({ isLoading: false, createdTasks: initialState.createdTasks })
    } else {
      lastCreatedTasksSubscription.unsubscribe = db.tasks.onSnapshot(async () => {
        set({
          isLoading: false,
          createdTasks: await getCreatedTasks(),
        })
      })
    }
  })

  return initialState
})
