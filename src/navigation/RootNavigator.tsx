import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { HomeNavigator } from './HomeNavigator'
import { OnboardingScreen } from '~/screens/Onboarding'
import { SignInScreen } from '~/screens/SignIn'
import { SignUpScreen } from '~/screens/SignUp'
import { HorizontalLogo } from '~/assets'
import { reactNavigationTheme } from '~/theme'

const Stack = createStackNavigator()

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => <HorizontalLogo />,
          headerTintColor: reactNavigationTheme.colors.primary,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => <HorizontalLogo />,
          headerTintColor: reactNavigationTheme.colors.primary,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeNavigator}
      />
    </Stack.Navigator>
  )
}
