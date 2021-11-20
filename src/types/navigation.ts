import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  AlternativeQuestionModel,
  Contest,
  CreateContestOptions,
  CreateTaskOptions,
  ListenQuestionModel,
  OrganizeQuestionModel,
  QuestionModel,
  SpeechQuestionModel,
  Task,
  TaskResults,
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
  AddFriend: undefined
  TasksHistory: undefined
  ContestsHistory: undefined

  SaveTask?: {
    initialValues?: CreateTaskOptions & { id?: string }
    questionToSave?: {
      index?: number
      data?: QuestionModel
    }
  }

  SaveAlternativeQuestion?: {
    initialValues?: AlternativeQuestionModel
    questionIndex?: number
    imageUriToSave?: string
  }

  SelectImage: {
    screenToNavigateOnSave: keyof RootParamList
  }

  SaveListenQuestion?: {
    initialValues?: ListenQuestionModel
    questionIndex?: number
  }

  SaveSpeechQuestion?: {
    initialValues?: SpeechQuestionModel
    questionIndex?: number
  }

  SaveOrganizeQuestion?: {
    initialValues?: OrganizeQuestionModel
    questionIndex?: number
  }

  TaskDetails: {
    task: Task
  }

  TaskSolving: {
    contestId?: string
    task: Task
    questionIndex: number
    results: Array<{
      isCorrectAnswered: boolean
      timeSpent: number
    }>
  }

  TaskResults: {
    contestId?: string
    results: Omit<TaskResults, 'submittedAt'>
  }

  SaveContest?: {
    initialValues?: CreateContestOptions & { id?: string }
    taskToSelect?: Task | null
  }

  SelectTask: undefined

  ContestDetails: {
    contest: Contest
  }

  ContestPassword: {
    contest: Contest
  }

  ParticipatingContestDetails: {
    contest: Contest
  }
}
export type RootScreen<T extends keyof RootParamList> = React.FC<StackScreenProps<RootParamList, T>>

export type HomeParamList = {
  Tasks: NavigatorScreenParams<TasksParamList>
  Contests: NavigatorScreenParams<ContestsParamList>
  Profile: undefined
}
export type HomeScreen<T extends keyof HomeParamList> = React.FC<
  CompositeScreenProps<BottomTabScreenProps<HomeParamList, T>, StackScreenProps<RootParamList>>
>

export type TasksParamList = {
  CommunityTasks: undefined
  CreatedTasks: undefined
}
export type TasksScreen<T extends keyof TasksParamList> = React.FC<
  CompositeScreenProps<
    BottomTabScreenProps<HomeParamList, 'Tasks'>,
    CompositeScreenProps<MaterialTopTabScreenProps<TasksParamList, T>, StackScreenProps<RootParamList>>
  >
>

export type ContestsParamList = {
  CommunityContests: undefined
  CreatedContests: undefined
  ParticipatingContests: undefined
}
export type ContestsScreen<T extends keyof ContestsParamList> = React.FC<
  CompositeScreenProps<
    BottomTabScreenProps<HomeParamList, 'Contests'>,
    CompositeScreenProps<MaterialTopTabScreenProps<ContestsParamList, T>, StackScreenProps<RootParamList>>
  >
>
