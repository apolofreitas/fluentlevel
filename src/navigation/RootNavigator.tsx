import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { HomeNavigator } from './HomeNavigator'

import { RootParamList } from '~/types/navigation'
import { useAuth } from '~/hooks'
import { Header } from '~/components/Header'

import { SplashScreen } from '~/screens/SplashScreen'
import { OnboardingScreen } from '~/screens/OnboardingScreen'
import { SignInScreen } from '~/screens/SignInScreen'
import { SignUpScreen } from '~/screens/SignUpScreen'
import { ResetPasswordScreen } from '~/screens/ResetPasswordScreen'
import { SaveTaskScreen } from '~/screens/SaveTaskScreen'
import { SaveQuestionScreen } from '~/screens/SaveQuestionScreen'

const Stack = createStackNavigator<RootParamList>()

export function RootNavigator() {
  const { isSignedIn, isLoading } = useAuth()

  if (isLoading) return <SplashScreen />

  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <>
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeNavigator} />
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
                      !Object.keys(props.route.params || {}).includes('initialValues')
                        ? 'Nova Tarefa'
                        : 'Editando Tarefa'
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
                      !Object.keys(props.route.params || {}).includes('initialValues')
                        ? 'Nova Questão'
                        : 'Editando Questão'
                    }
                    headerRight={props.options.headerRight}
                  />
                )
              },
            }}
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  )
}
