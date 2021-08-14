import * as React from 'react'
import { Button, Center, Text, VStack } from 'native-base'

import { useNavigation } from '@react-navigation/core'
import { Logo } from '~/assets'
import { LoginWithGoogleButton } from '~/components'

export function OnboardingScreen() {
  const navigation = useNavigation()

  return (
    <Center flex={1} paddingX={8}>
      <Logo />
      <Text fontSize="xl" fontWeight="600" marginTop={4} marginBottom={16}>
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
