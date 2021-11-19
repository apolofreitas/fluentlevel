import React from 'react'
import { Box, Pressable, ScrollView, Text, VStack } from 'native-base'

import { useContests } from '~/hooks'
import { ContestsScreen } from '~/types/navigation'
import { LoadingScreen } from './LoadingScreen'
import dateFormat from 'dateformat'

export const ParticipatingContestsScreen: ContestsScreen<'ParticipatingContests'> = ({ navigation }) => {
  const { participatingContests, isLoading } = useContests()

  if (isLoading) return <LoadingScreen />

  return (
    <ScrollView>
      <Box paddingX={6} paddingY={4}>
        <VStack space={3}>
          {participatingContests.length === 0 ? (
            <Text textAlign="center" fontWeight="600">
              Você não está participando de nenhuma competição
            </Text>
          ) : (
            participatingContests.map((contest) => {
              return (
                <Pressable
                  key={contest.id}
                  onPress={() => navigation.navigate('ParticipatingContestDetails', { contest })}
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
                    <Text color="primary.700">@{contest.author.username}</Text>
                    <Text color="gray.500" fontSize="sm">
                      {`Duração: ${dateFormat(contest.startDate.toDate(), 'dd/mm/yy HH:MM')} - ${dateFormat(
                        contest.endDate.toDate(),
                        'dd/mm/yy HH:MM',
                      )}`}
                    </Text>
                    {!!contest.description && <Text>{contest.description}</Text>}
                  </Box>
                </Pressable>
              )
            })
          )}
        </VStack>
      </Box>
    </ScrollView>
  )
}
