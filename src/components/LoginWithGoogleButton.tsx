import * as React from 'react'
import { Button, Factory, Spacer } from 'native-base'

import api from '~/api'
import { GoogleLogo } from '~/assets'

export const LoginWithGoogleButton = Factory(() => {
  return (
    <Button
      colorScheme="blue"
      paddingX="4px"
      justifyContent="flex-start"
      startIcon={
        <>
          <GoogleLogo position="absolute" left="0" />
          <Spacer />
        </>
      }
      endIcon={<Spacer />}
      onPress={api.auth.signInWithGoogle}
    >
      Entrar com google
    </Button>
  )
})
