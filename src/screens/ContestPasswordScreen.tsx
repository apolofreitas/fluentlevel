import React, { useState } from 'react'
import { Button, Icon, Input, ScrollView, Text, useToast, VStack } from 'native-base'

import { RootScreen } from '~/types/navigation'
import Feather from 'react-native-vector-icons/Feather'
import { participateInContest } from '~/api'
import { showSimpleToast } from '~/utils/showSimpleToast'

export const ContestPasswordScreen: RootScreen<'ContestPassword'> = ({ navigation, route }) => {
  const { contest } = route.params
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [isShowingActualPassword, setIsShowingActualPassword] = useState(false)

  return (
    <>
      <ScrollView>
        <VStack paddingY={2} paddingX={6} paddingBottom={24} space={2}>
          <Text color="primary.700" fontWeight="600" fontSize="lg">
            Senha
          </Text>
          <Input
            value={password}
            onChangeText={setPassword}
            type={isShowingActualPassword ? 'text' : 'password'}
            InputRightElement={
              <Button
                variant="unstyled"
                padding={4}
                onPress={() => setIsShowingActualPassword(!isShowingActualPassword)}
              >
                {isShowingActualPassword ? (
                  <Icon as={Feather} name="eye-off" size={4} color="primary.500" />
                ) : (
                  <Icon as={Feather} name="eye" size={4} color="primary.500" />
                )}
              </Button>
            }
            placeholder="Senha da competição"
          />
        </VStack>
      </ScrollView>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        isLoading={isLoading}
        onPress={async () => {
          if (contest.password !== password)
            return showSimpleToast(toast, 'A senha não corresponde aos nossos registros.')

          setIsLoading(true)
          await participateInContest(contest.id)
          navigation.navigate('Home', {
            screen: 'Contests',
            params: {
              screen: 'ParticipatingContests',
            },
          })
        }}
      >
        Participar
      </Button>
    </>
  )
}
