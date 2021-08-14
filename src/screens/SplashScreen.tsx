import * as React from 'react'
import { Center } from 'native-base'

import { Logo } from '~/assets'

export function SplashScreen() {
  return (
    <Center flex={1} backgroundColor="background">
      <Logo />
    </Center>
  )
}
