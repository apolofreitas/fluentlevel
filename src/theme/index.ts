import { Theme as ReactNavigationTheme } from '@react-navigation/native'
import { StatusBarProps } from 'react-native'
import { extendTheme } from 'native-base'

import { colors } from './colors'
import { fontConfig, fonts } from './fonts'
import { components } from './components'

export const nativeBaseTheme = extendTheme({
  colors,
  fontConfig,
  fonts,
  components,
  config: {
    useSystemColorMode: false,
    initialColorMode: 'light',
  },
})

export const reactNavigationTheme: ReactNavigationTheme = {
  dark: false,
  colors: {
    text: nativeBaseTheme.colors.darkText,
    background: nativeBaseTheme.colors.background,
    card: nativeBaseTheme.colors.card,
    border: nativeBaseTheme.colors.gray[200],
    primary: nativeBaseTheme.colors.primary[700],
    notification: nativeBaseTheme.colors.primary[700],
  },
}

export const statusBarProps: StatusBarProps = {
  barStyle: 'light-content',
  backgroundColor: nativeBaseTheme.colors.primary[700],
}
