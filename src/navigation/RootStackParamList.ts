export type RootStackParamList = {
  Home: undefined
  Onboarding: undefined
  SignIn: undefined
  SignUp: undefined
  ResetPassword: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
