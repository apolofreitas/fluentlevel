import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { useAuth } from '~/hooks'

import { RootStackParamList } from './RootStackParamList'
import { HomeNavigator } from './HomeNavigator'

import { SplashScreen } from '~/screens/SplashScreen'
import { OnboardingScreen } from '~/screens/OnboardingScreen'
import { SignInScreen } from '~/screens/SignInScreen'
import { SignUpScreen } from '~/screens/SignUpScreen'
import { ResetPasswordScreen } from '~/screens/ResetPasswordScreen'
import { Header } from '~/components/Header'

const Stack = createStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const isInitializing = useAuth((auth) => auth.isInitializing)
  const isSignedIn = useAuth((auth) => auth.isSignedIn)

  if (isInitializing) {
    return <SplashScreen />
  }

  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <>
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeNavigator} />
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
