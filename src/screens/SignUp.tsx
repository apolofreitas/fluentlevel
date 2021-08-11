import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Box, Button, Center, Input, VStack } from 'native-base'

import { HorizontalLogo } from '~/assets'
import { reactNavigationTheme } from '~/theme'
import Feather from 'react-native-vector-icons/Feather'
import { colors } from '~/theme/colors'
import { useNavigation } from '@react-navigation/core'

export function SignUpScreen() {
  const navigation = useNavigation<any>()
  const [isPasswordShowing, setIsPasswordShowing] = React.useState(false)

  return (
    <Center flex={1} paddingX="32px">
      <Box width="100%">
        <VStack space={4} width="100%" marginBottom="32px">
          <Input placeholder="Nome" />
          <Input placeholder="Nome de usuário" />
          <Input placeholder="Email" />
          <Input
            type={isPasswordShowing ? 'text' : 'password'}
            InputRightElement={
              <Button
                variant="unstyled"
                onPress={() => setIsPasswordShowing(!isPasswordShowing)}
              >
                {isPasswordShowing ? (
                  <Feather
                    name="eye-off"
                    size={16}
                    color={colors.primary[500]}
                  />
                ) : (
                  <Feather name="eye" size={16} color={colors.primary[500]} />
                )}
              </Button>
            }
            placeholder="Senha"
          />
        </VStack>
        <Button width="100%" onPress={() => navigation.navigate('Home')}>
          Criar Conta
        </Button>
      </Box>
    </Center>
  )
}
