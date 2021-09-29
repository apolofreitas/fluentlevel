import * as React from 'react'
import { HStack, Icon, Pressable, Spacer, Text, VStack } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { RootScreen } from '~/types/navigation'
import { useCurrentUser } from '~/hooks'

export const MyAccountScreen: RootScreen<'MyAccount'> = ({ navigation }) => {
  const { currentUser } = useCurrentUser()

  return (
    <VStack paddingY={2} paddingX={6} space={3}>
      <Pressable onPress={() => navigation.navigate('ChangeEmail')}>
        <HStack alignItems="center" backgroundColor="card" borderRadius="16px" paddingX={5} paddingY={3}>
          <Text color="primary.700" fontSize="lg" fontWeight="600">
            Email
          </Text>
          <Spacer />
          <Text color="primary.700" fontWeight="600">
            {currentUser.email}
          </Text>
          <Icon as={Feather} name="chevron-right" size="sm" />
        </HStack>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('ChangePassword')}>
        <HStack backgroundColor="card" borderRadius="16px" paddingX={5} paddingY={3}>
          <Text color="primary.700" fontSize="lg" fontWeight="600">
            Mudar Senha
          </Text>
          <Spacer />
          <Icon as={Feather} name="chevron-right" size="sm" />
        </HStack>
      </Pressable>
    </VStack>
  )
}
