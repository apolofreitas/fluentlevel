import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export interface UserModel {
  nickname: string
  username: string
  email: string
  bio: string
  following: string[]
  followers: string[]

  tasksScore: number
  createdTasks: string[]
  tasksHistory: TaskResults[]

  contestsScore: number
  createdContests: string[]
  contestsHistory: ContestResults[]

  participatingContests: string[]
}

export interface AlternativeQuestionModel {
  type: 'ALTERNATIVE_QUESTION'
  info: string
  timeToAnswer: number

  alternatives: string[]
  rightAlternativeIndex: number
}

export interface ListenQuestionModel {
  type: 'LISTEN_QUESTION'
  info: string
  timeToAnswer: number

  phraseToRecognize: string
}

export interface SpeechQuestionModel {
  type: 'SPEECH_QUESTION'
  info: string
  timeToAnswer: number

  phraseToSpeech: string
}

export interface OrganizeQuestionModel {
  type: 'ORGANIZE_QUESTION'
  info: string
  timeToAnswer: number

  phraseToOrganize: string
}

export type QuestionModel = ListenQuestionModel | SpeechQuestionModel | OrganizeQuestionModel | AlternativeQuestionModel

export interface TaskModel {
  authorId: string
  isPublic: boolean
  isDeleted: boolean

  title: string
  description: string
  questions: Array<QuestionModel>
}

export interface TaskResults {
  taskId: string
  totalScore: number
  correctQuestionsAmount: number
  questionsAmount: number
  timeSpent: number
  totalTime: number
}
export interface ContestModel {
  authorId: string
  isDeleted: boolean

  title: string
  description: string
  password: string
  startDate: FirebaseFirestoreTypes.Timestamp
  endDate: FirebaseFirestoreTypes.Timestamp
  taskId: string
  participatingUsers: string[]
}

export interface ContestResults extends TaskResults {
  contestId: string
}

const users = firestore().collection<UserModel>('users')
const tasks = firestore().collection<TaskModel>('tasks')
const contests = firestore().collection<ContestModel>('contests')

export const db = { users, tasks, contests }
