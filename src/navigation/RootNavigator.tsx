import * as React from 'react'
import { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from 'react-native-splash-screen'

import { HomeNavigator } from './HomeNavigator'

import { RootParamList } from '~/types/navigation'
import { useAuth } from '~/hooks'
import { Header } from '~/components/Header'

import { OnboardingScreen } from '~/screens/OnboardingScreen'
import { SignInScreen } from '~/screens/SignInScreen'
import { SignUpScreen } from '~/screens/SignUpScreen'
import { ResetPasswordScreen } from '~/screens/ResetPasswordScreen'
import { SaveTaskScreen } from '~/screens/SaveTaskScreen'
import { SaveQuestionScreen } from '~/screens/SaveQuestionScreen'
import { TaskDetailsScreen } from '~/screens/TaskDetailsScreen'
import { FinishedTaskScreen } from '~/screens/FinishedTaskScreen'
import { TaskSolvingScreen } from '~/screens/TaskSolvingScreen'
import { EditProfileScreen } from '~/screens/EditProfileScreen'
import { MyAccountScreen } from '~/screens/MyAccountScreen'
import { ChangeEmailScreen } from '~/screens/ChangeEmailScreen'
import { ChangePasswordScreen } from '~/screens/ChangePasswordScreen'

const Stack = createStackNavigator<RootParamList>()

export function RootNavigator() {
  const { isSignedIn, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) setTimeout(SplashScreen.hide, 1500)
  }, [isLoading])

  if (isLoading) return null

  if (!isSignedIn) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            header: () => <Header canGoBack showLogoInTitle centerTitle />,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            header: () => <Header canGoBack showLogoInTitle centerTitle />,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{
            header: () => <Header canGoBack showLogoInTitle centerTitle />,
          }}
        />
      </Stack.Navigator>
    )
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeNavigator} />
      <Stack.Screen
        name="EditProfile"
        options={{ header: () => <Header canGoBack centerTitle title="Editar Perfil" /> }}
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="MyAccount"
        options={{ header: () => <Header canGoBack centerTitle title="Minha Conta" /> }}
        component={MyAccountScreen}
      />
      <Stack.Screen
        name="ChangeEmail"
        options={{ header: () => <Header canGoBack centerTitle title="Editar Email" /> }}
        component={ChangeEmailScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        options={{ header: () => <Header canGoBack centerTitle title="Mudar Senha" /> }}
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="SaveTask"
        component={SaveTaskScreen}
        options={{
          header: (props) => {
            return (
              <Header
                canGoBack
                centerTitle
                title={
                  !Object.keys(props.route.params || {}).includes('initialValues') ? 'Nova Tarefa' : 'Editando Tarefa'
                }
                headerRight={props.options.headerRight}
              />
            )
          },
        }}
      />
      <Stack.Screen
        name="SaveQuestion"
        component={SaveQuestionScreen}
        options={{
          header: (props) => {
            return (
              <Header
                canGoBack
                centerTitle
                title={
                  !Object.keys(props.route.params || {}).includes('initialValues') ? 'Nova Questão' : 'Editando Questão'
                }
                headerRight={props.options.headerRight}
              />
            )
          },
        }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{
          header: () => <Header canGoBack title="" />,
        }}
      />
      <Stack.Screen
        name="FinishedTask"
        component={FinishedTaskScreen}
        options={{
          header: () => <Header title="" />,
        }}
      />
      <Stack.Screen
        name="TaskSolving"
        component={TaskSolvingScreen}
        options={{
          title: '',
          header: (props) => <Header centerTitle title={props.options.title} />,
        }}
      />
    </Stack.Navigator>
  )
}
