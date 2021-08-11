import * as React from 'react'
import { Button, Center, Text, VStack } from 'native-base'

import { useNavigation } from '@react-navigation/core'
import { Logo } from '~/assets'
import { LoginWithGoogleButton } from '~/components'

export function OnboardingScreen() {
  const navigation = useNavigation<any>()

  return (
    <Center flex={1} paddingX="32px">
      <Logo />
      <Text fontSize="xl" fontWeight="600" marginTop="16px" marginBottom="64px">
        Bem vindo ao fluentlevel!
      </Text>
      <VStack space={4} width="100%">
        <Button onPress={() => navigation.navigate('SignIn')}>Entrar</Button>
        <Button variant="outline" onPress={() => navigation.navigate('SignUp')}>
          Criar conta
        </Button>
        <LoginWithGoogleButton />
      </VStack>
    </Center>
  )
}
