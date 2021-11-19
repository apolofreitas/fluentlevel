import React, { useState } from 'react'
import { Box, Button, HStack, ScrollView, Text, VStack } from 'native-base'
import dateFormat from 'dateformat'

import { RootScreen } from '~/types/navigation'
import { participateInContest } from '~/api'
import { useCurrentUser } from '~/hooks'

export const ContestDetailsScreen: RootScreen<'ContestDetails'> = ({ navigation, route }) => {
  const { contest } = route.params
  const { currentUser } = useCurrentUser()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <ScrollView>
        <Box paddingX={8} paddingY={2} paddingBottom={24}>
          <VStack width="100%" space={2}>
            <Text color="primary.500" fontSize="4xl" fontWeight="700">
              {contest.title}
            </Text>
            <Text fontSize="lg" fontWeight="600" color="primary.700" marginBottom={2}>
              @{contest.author.username}
            </Text>

            <Box width="100%" backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
              <Text color="primary.500" fontWeight="700" fontSize="lg">
                Duração
              </Text>
              <Text>
                {`${dateFormat(contest.startDate.toDate(), 'dd/mm/yy HH:MM')} - ${dateFormat(
                  contest.endDate.toDate(),
                  'dd/mm/yy HH:MM',
                )}`}
              </Text>
            </Box>

            {!!contest.description && (
              <Box width="100%" backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
                <Text color="primary.500" fontWeight="700" fontSize="lg">
                  Informações
                </Text>
                <Text>{contest.description}</Text>
              </Box>
            )}
          </VStack>
        </Box>
      </ScrollView>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        isDisabled={contest.participatingUsers.some(({ id }) => id === currentUser.id)}
        isLoading={isLoading}
        onPress={async () => {
          if (!!contest.password && contest.authorId !== currentUser.id) {
            return navigation.navigate('ContestPassword', { contest })
          }

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
        {!contest.participatingUsers.some(({ id }) => id === currentUser.id) ? 'Participar' : 'Participando'}
      </Button>
    </>
  )
}
