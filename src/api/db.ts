import firestore from '@react-native-firebase/firestore'

export interface UserModel {
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

export interface QuestionModel {
  statement: string
  timeToAnswer: number
  alternatives: string[]
  rightAlternativeIndex: number
}

export interface TaskModel {
  authorId: string
  isPublic: boolean

  title: string
  description: string
  questions: Array<QuestionModel>
}

export interface ContestModel {
  authorId: string

  title: string
  description: string
  password: string
  startTime: Date
  finishTime: Date
  taskId: string
}

const users = firestore().collection<UserModel>('users')
const tasks = firestore().collection<TaskModel>('tasks')
const contests = firestore().collection<ContestModel>('contests')

export const db = { users, tasks, contests }
