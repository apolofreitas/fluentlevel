import { StackScreenProps } from '@react-navigation/stack'
import { Task, TaskModel } from '~/api'

export type RootParamList = {
  Onboarding: undefined
  SignIn: undefined
  SignUp: undefined
  ResetPassword: undefined

  Home: undefined
  SaveTask?: {
    initialValues?: Task
    questionToSave?: {
      index?: number
      data?: TaskModel['questions'][number]
    }
  }
  SaveQuestion?: {
    initialValues?: TaskModel['questions'][number]
    questionIndex?: number
  }
}
export type RootScreen<T extends keyof RootParamList> = React.FC<StackScreenProps<RootParamList, T>>

export type HomeParamList = {
  Tasks: undefined
  Contests: undefined
  Profile: undefined
}
export type HomeScreen<T extends keyof HomeParamList> = React.FC<StackScreenProps<HomeParamList, T>>
