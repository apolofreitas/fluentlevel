import * as React from 'react'
import { Button, Factory, Spacer } from 'native-base'
import { useNavigation } from '@react-navigation/core'

import { GoogleLogo } from '~/assets'

export const LoginWithGoogleButton = Factory(() => {
  const navigation = useNavigation<any>()

  return (
    <Button
      colorScheme="blue"
      paddingX="2px"
      paddingY="2px"
      justifyContent="flex-start"
      startIcon={
        <>
          <GoogleLogo position="absolute" left="1px" />
          <Spacer />
        </>
      }
      endIcon={<Spacer />}
      onPress={() => navigation.navigate('Home')}
    >
      Entrar com google
    </Button>
  )
})
