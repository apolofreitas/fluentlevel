import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Box, Button, Divider, HStack, Icon, IconButton, ScrollView, Text, VStack } from 'native-base'

import { RootScreen } from '~/types/navigation'
import Feather from 'react-native-vector-icons/Feather'
import { removeParticipationInContest } from '~/api'
import { firebase } from '@react-native-firebase/firestore'
import { formatTime } from '~/utils/formatTime'
import { useCurrentUser } from '~/hooks'

export const ParticipatingContestDetailsScreen: RootScreen<'ParticipatingContestDetails'> = ({ navigation, route }) => {
  const { contest } = route.params

  const { currentUser } = useCurrentUser()
  const [timeToStart, setTimeToStart] = useState(calculateTimeToStart)
  const [timeToEnd, setTimeToEnd] = useState(calculateTimeToEnd)
  const [isSolved, setIsSolved] = useState(calculateIsSolved)
  const [ranking, setRanking] = useState(calculateRanking)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !!currentUser.participatingContests.find((contestId) => contestId === contest.id) && (
          <IconButton
            variant="unstyled"
            icon={
              <Icon
                as={Feather}
                name="trash"
                size="sm"
                onPress={async () => {
                  Alert.alert(
                    'Remover competição',
                    'Tem certeza que deseja remover a competição de "Participando"?',
                    [
                      {
                        text: 'Cancelar',
                        style: 'cancel',
                      },
                      {
                        text: 'Remover',
                        onPress: async () => {
                          removeParticipationInContest(contest.id)
                          navigation.goBack()
                        },
                      },
                    ],
                    {
                      cancelable: true,
                    },
                  )
                }}
              />
            }
          />
        ),
    })
  }, [navigation])

  useEffect(() => {
    const id = setInterval(() => {
      setTimeToStart(calculateTimeToStart)
      setTimeToEnd(calculateTimeToEnd)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setIsSolved(calculateIsSolved)
    setRanking(calculateRanking)
  }, [currentUser])

  function calculateTimeToStart() {
    const nowInMs = firebase.firestore.Timestamp.fromDate(new Date()).toMillis()
    const startDateInMs = contest.startDate.toMillis()

    if (startDateInMs <= nowInMs) return null

    return startDateInMs - nowInMs
  }

  function calculateTimeToEnd() {
    const nowInMs = firebase.firestore.Timestamp.fromDate(new Date()).toMillis()
    const startDateInMs = contest.startDate.toMillis()
    const endDateInMs = contest.endDate.toMillis()

    if (nowInMs < startDateInMs) return null
    if (endDateInMs <= nowInMs) return null

    return endDateInMs - nowInMs
  }

  function calculateIsSolved() {
    return currentUser.contestsHistory.find((history) => history.contestId === contest.id)
  }

  function calculateRanking() {
    return contest.ranking
      .map((user) => ({
        user,
        score: user.contestsHistory.find(({ contestId }) => contestId === contest.id)?.totalScore || 0,
      }))
      .sort((a, b) => b.score - a.score)
  }

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
          </VStack>

          {!!timeToStart && !isSolved ? (
            <VStack space={3} paddingY={2}>
              <Text color="primary.700" fontSize="2xl" fontWeight="700">
                Aguardando começar...
              </Text>
              <Text color="primary.500" fontSize="4xl" fontWeight="700">
                {formatTime(timeToStart, { showDetails: true })}
              </Text>

              {!!contest.description && (
                <Box width="100%" backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
                  <Text color="primary.500" fontWeight="700" fontSize="lg">
                    Informações
                  </Text>
                  <Text>{contest.description}</Text>
                </Box>
              )}
            </VStack>
          ) : !!timeToEnd && !isSolved ? (
            <VStack space={3} paddingY={2}>
              <VStack>
                <Text color="primary.700" fontSize="2xl" fontWeight="700">
                  Tempo para resolver:
                </Text>
                <Text color="primary.500" fontSize="4xl" fontWeight="700">
                  {formatTime(timeToEnd, { showDetails: true })}
                </Text>
              </VStack>

              <Text color="primary.700" fontSize="2xl" fontWeight="700">
                Tarefa:
              </Text>

              <Box width="100%" backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
                <Text color="primary.500" fontWeight="700" fontSize="lg">
                  {contest.task.title}
                </Text>

                <HStack width="100%" justifyContent="space-between" marginBottom={1}>
                  <Text fontWeight="600" color="primary.700">
                    @{contest.task.author.username}
                  </Text>

                  <Text fontWeight="600">
                    {contest.task.questions.length > 1
                      ? `${contest.task.questions.length} questões`
                      : `${contest.task.questions.length} questão`}
                  </Text>
                </HStack>

                {contest.task.description && (
                  <Text color="gray.500" isTruncated>
                    {contest.task.description}
                  </Text>
                )}
              </Box>
            </VStack>
          ) : (
            <VStack space={3} paddingY={2}>
              <Text textAlign="center" color="primary.700" fontSize="xl" fontWeight="700">
                Resultados da competição
              </Text>

              <VStack
                space={3}
                justifyContent="space-between"
                width="100%"
                backgroundColor="card"
                borderRadius="16px"
                paddingX={6}
                paddingY={3}
                divider={<Divider bgColor="gray.300" />}
              >
                {ranking.map(({ user, score }, index) => (
                  <HStack key={user.id} space={4} justifyContent="space-between">
                    <Text color="primary.500" fontWeight="700">
                      {index + 1}º
                    </Text>
                    <Text fontWeight="600">{user.nickname}</Text>
                    <Text color="primary.700" fontWeight="600">
                      @{user.username}
                    </Text>
                    <Text fontWeight="600">{score} pontos</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          )}
        </Box>
      </ScrollView>

      {(!!timeToStart || !!timeToEnd) && !isSolved ? (
        <Button
          position="absolute"
          bottom="24px"
          left="32px"
          right="32px"
          isDisabled={!timeToEnd}
          onPress={() =>
            navigation.navigate('TaskSolving', {
              contestId: contest.id,
              task: contest.task,
              questionIndex: 0,
              results: [],
            })
          }
        >
          Começar
        </Button>
      ) : (
        <Button position="absolute" bottom="24px" left="32px" right="32px" onPress={() => navigation.goBack()}>
          Finalizar
        </Button>
      )}
    </>
  )
}
