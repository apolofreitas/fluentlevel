import React from 'react'
import { NativeBaseProvider, StatusBar } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'

import 'react-native-reanimated'

import { nativeBaseTheme, reactNavigationTheme, statusBarProps } from '~/theme'
import { RootNavigator } from '~/navigation/RootNavigator'

export function App() {
  return (
    <NativeBaseProvider theme={nativeBaseTheme}>
      <NavigationContainer theme={reactNavigationTheme}>
        <StatusBar {...statusBarProps} />
        <RootNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
