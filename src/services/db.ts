import firestore from '@react-native-firebase/firestore'

export interface User {
  nickname: string
  username: string
  email: string
  following: string[]
  followers: string[]

  tasksScore: number
  createdTasks: string[]
  tasksHistory: string[]

  contestsScore: number
  createdContests: string[]
  contestsHistory: string[]
}

export const users = firestore().collection<User>('users')
