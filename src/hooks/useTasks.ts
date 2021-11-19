import create from 'zustand'
import auth from '@react-native-firebase/auth'
import { db, getTasks, Task } from '~/api'

export interface TasksState {
  isLoading: boolean
  tasks: Task[]
  createdTasks: Task[]
  communityTasks: Task[]
}

export const useTasks = create<TasksState>((set) => {
  const initialState: TasksState = {
    tasks: [],
    createdTasks: [],
    communityTasks: [],
    isLoading: true,
  }

  const lastTasksSubscription = {
    unsubscribe: () => {},
  }

  auth().onAuthStateChanged(async (currentUser) => {
    lastTasksSubscription.unsubscribe()

    set({ isLoading: false })

    if (!currentUser) {
      set({ isLoading: false, tasks: initialState.tasks })
    } else {
      lastTasksSubscription.unsubscribe = db.tasks.onSnapshot(async () => {
        const tasks = await getTasks()
        set({
          isLoading: false,
          tasks,
          createdTasks: tasks.filter((task) => task.authorId === currentUser.uid),
          communityTasks: tasks.filter((task) => task.authorId !== currentUser.uid),
        })
      })
    }
  })

  return initialState
})
