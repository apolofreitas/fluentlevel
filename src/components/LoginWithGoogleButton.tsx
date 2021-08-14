import * as React from 'react'
import { Button, Factory, Spacer } from 'native-base'

import { GoogleLogo } from '~/assets'
import { signInWithGoogle } from '~/api'

export const LoginWithGoogleButton = Factory(() => {
  return (
    <Button
      colorScheme="blue"
      paddingX={1}
      justifyContent="flex-start"
      startIcon={
        <>
          <GoogleLogo position="absolute" left="0" />
          <Spacer />
        </>
      }
      endIcon={<Spacer />}
      onPress={signInWithGoogle}
    >
      Entrar com google
    </Button>
  )
})
