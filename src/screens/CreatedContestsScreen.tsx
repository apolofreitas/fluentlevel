import React from 'react'
import { Alert } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { Box, Fab, Icon, Pressable, ScrollView, Text, VStack } from 'native-base'

import { useContests } from '~/hooks'
import { ContestsScreen } from '~/types/navigation'
import { LoadingScreen } from './LoadingScreen'
import dateFormat from 'dateformat'

export const CreatedContestsScreen: ContestsScreen<'CreatedContests'> = ({ navigation }) => {
  const { createdContests, isLoading } = useContests()

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <ScrollView>
        <Box paddingX={6} paddingY={4}>
          <VStack space={3}>
            {createdContests.length === 0 ? (
              <Text textAlign="center" fontWeight="600">
                Ainda não tem nada por aqui.
              </Text>
            ) : (
              createdContests.map((contest) => (
                <Pressable
                  key={contest.id}
                  onPress={() => {
                    Alert.alert(
                      contest.title,
                      contest.description,
                      [
                        {
                          text: 'Cancelar',
                          style: 'cancel',
                        },
                        {
                          text: 'Editar',
                          onPress: () => navigation.navigate('SaveContest', { initialValues: contest }),
                        },
                        {
                          text: 'Começar',
                          onPress: () => undefined,
                        },
                      ],
                      {
                        cancelable: true,
                      },
                    )
                  }}
                >
                  <Box backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
                    <Text
                      flexShrink={1}
                      isTruncated
                      textAlign="justify"
                      fontSize="lg"
                      fontWeight="700"
                      color="primary.500"
                    >
                      {contest.title}
                    </Text>
                    <Text color="primary.700">
                      {`Duração: ${dateFormat(contest.startDate.toDate(), 'dd/mm/yy HH:MM')} - ${dateFormat(
                        contest.endDate.toDate(),
                        'dd/mm/yy HH:MM',
                      )}`}
                    </Text>
                    {!!contest.description && <Text marginTop={1}>{contest.description}</Text>}
                  </Box>
                </Pressable>
              ))
            )}
          </VStack>
        </Box>
      </ScrollView>

      <Fab
        renderInPortal={false}
        right={4}
        bottom={4}
        icon={<Icon as={Feather} name="plus" />}
        onPress={() => navigation.navigate('SaveContest')}
      />
    </>
  )
}
