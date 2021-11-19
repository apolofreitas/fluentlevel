import React from 'react'
import { Box, HStack, Pressable, ScrollView, Text, VStack } from 'native-base'
import dateFormat from 'dateformat'

import { RootScreen } from '~/types/navigation'
import { useCurrentUser, useContests } from '~/hooks'

export const ContestsHistoryScreen: RootScreen<'ContestsHistory'> = ({ navigation }) => {
  const { currentUser } = useCurrentUser()
  const { contests } = useContests()

  return (
    <ScrollView>
      <VStack paddingX={5} paddingY={3} space={2}>
        {currentUser.contestsHistory.map(({ contestId, contest, totalScore, submittedAt }) => (
          <Pressable
            key={contestId}
            onPress={async () => {
              const contest = contests.find(({ id }) => id === contestId)
              if (!contest) return
              navigation.navigate('ParticipatingContestDetails', { contest })
            }}
          >
            <Box backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
              <Text flexShrink={1} isTruncated textAlign="justify" fontSize="lg" fontWeight="700" color="primary.500">
                {contest.title}
              </Text>

              <HStack justifyContent="space-between">
                <Text fontWeight="700" color="primary.700">
                  {totalScore} pontos
                </Text>
                <Text color="gray.500">{dateFormat(submittedAt.toDate(), 'dd/mm/yyyy')}</Text>
              </HStack>
            </Box>
          </Pressable>
        ))}
      </VStack>
    </ScrollView>
  )
}
