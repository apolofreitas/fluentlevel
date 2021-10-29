import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  AlternativeQuestionModel,
  ListenQuestionModel,
  QuestionModel,
  SpeechQuestionModel,
  Task,
  User,
  UserModel,
} from '~/api'

export type RootParamList = {
  Onboarding: undefined
  SignIn: undefined
  SignUp: undefined
  ResetPassword: undefined

  Home?: NavigatorScreenParams<HomeParamList>

  EditProfile: undefined
  MyAccount: undefined
  ChangeEmail: undefined
  ChangePassword: undefined

  UserDetails: {
    initialValues: {
      username: string
    }
  }
  FollowingUsers: { followingUsers: UserModel[] }
  FollowersUsers: { followersUsers: UserModel[] }

  SaveTask?: {
    initialValues?: Task
    questionToSave?: {
      index?: number
      data?: QuestionModel
    }
  }

  SaveAlternativeQuestion?: {
    initialValues?: AlternativeQuestionModel
    questionIndex?: number
  }

  SaveListenQuestion?: {
    initialValues?: ListenQuestionModel
    questionIndex?: number
  }

  SaveSpeechQuestion?: {
    initialValues?: SpeechQuestionModel
    questionIndex?: number
  }

  TaskDetails: {
    task: Task
  }

  TaskSolving: {
    task: Task
    questionIndex: number
    results: Array<{
      isCorrectAnswered: boolean
      timeSpent: number
    }>
  }

  TaskResults: {
    task: Task
    results: {
      correctAnswers: number
      totalScore: number
      totalTimeSpent: number
      totalTimeToAnswer: number
    }
  }
}
export type RootScreen<T extends keyof RootParamList> = React.FC<StackScreenProps<RootParamList, T>>

export type HomeParamList = {
  Tasks: undefined
  Contests: undefined
  Profile: undefined
}
export type HomeScreen<T extends keyof HomeParamList> = React.FC<
  CompositeScreenProps<BottomTabScreenProps<HomeParamList, T>, StackScreenProps<RootParamList>>
>
