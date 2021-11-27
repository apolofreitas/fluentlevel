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
  timeToAnswer: number

  statement: string
  imageUri?: string
  alternatives: string[]
  rightAlternativeIndex: number
}

export interface ListenQuestionModel {
  type: 'LISTEN_QUESTION'
  timeToAnswer: number

  phraseToRecognize: string
}

export interface SpeechQuestionModel {
  type: 'SPEECH_QUESTION'
  timeToAnswer: number

  phraseToSpeech: string
}

export interface OrganizeQuestionModel {
  type: 'ORGANIZE_QUESTION'
  timeToAnswer: number

  translatedPhraseToOrganize: string
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
  submittedAt: FirebaseFirestoreTypes.Timestamp
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
  ranking: string[]
}

export interface ContestResults extends TaskResults {
  contestId: string
}

export interface TaskReportModel {
  submittedAt: FirebaseFirestoreTypes.Timestamp
  reportingUserId: string
  taskId: string
  reason: string
}

export interface ContestReportModel {
  submittedAt: FirebaseFirestoreTypes.Timestamp
  reportingUserId: string
  contestId: string
  reason: string
}

const users = firestore().collection<UserModel>('users')
const tasks = firestore().collection<TaskModel>('tasks')
const contests = firestore().collection<ContestModel>('contests')
const taskReports = firestore().collection<TaskReportModel>('task-reports')
const contestReports = firestore().collection<ContestReportModel>('contest-reports')

export const db = { users, tasks, contests, taskReports, contestReports }
