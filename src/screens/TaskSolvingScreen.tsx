import * as React from 'react'
import { Alert, BackHandler } from 'react-native'
import { Box, Button, HStack, Icon, Pressable, ScrollView, Text, VStack } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { RootScreen } from '~/types/navigation'
import { OctopusIcon } from '~/components'
import { colors } from '~/theme/colors'
import { calculateQuestionScore } from '~/utils/calculateQuestionScore'
import { formatTime } from '~/utils/formatTime'

export const TaskSolvingScreen: RootScreen<'TaskSolving'> = ({ navigation, route }) => {
  const { task, results, questionIndex } = route.params
  const question = task.questions[questionIndex]
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = React.useState<number | null>(null)
  const [isShowingResults, setIsShowingResults] = React.useState(false)
  const [timeSpent, setTimeSpent] = React.useState(0)

  React.useEffect(() => {
    const timeSpentIntervalId = setInterval(() => {
      if (isShowingResults) return
      setTimeSpent((timeSpent) => timeSpent + 1)
    }, 1000)
    return () => clearInterval(timeSpentIntervalId)
  }, [isShowingResults])

  React.useEffect(() => {
    navigation.setOptions({ title: `Tempo: ${formatTime(question.timeToAnswer - timeSpent)}` })
    if (timeSpent === question.timeToAnswer) onNextQuestion()
  }, [timeSpent])

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Sair',
        'Tem certeza que quer voltar? Todo o seu progresso será perdido.',
        [
          {
            text: 'Cancelar',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Sair', onPress: () => navigation.goBack() },
        ],
        {
          cancelable: true,
        },
      )
      return true
    })

    return () => backHandler.remove()
  }, [])

  function onNextQuestion() {
    if (isShowingResults) return

    setIsShowingResults(true)

    setTimeout(() => {
      const updatedResults = [
        ...results,
        { timeSpent, isCorrectAnswered: selectedAlternativeIndex === question.rightAlternativeIndex },
      ]

      if (questionIndex < task.questions.length - 1) {
        return navigation.replace('TaskSolving', {
          task,
          questionIndex: questionIndex + 1,
          results: updatedResults,
        })
      }

      const correctAnswers = updatedResults.reduce((acc, result) => acc + (result.isCorrectAnswered ? 1 : 0), 0)
      const totalTimeSpent = updatedResults.reduce((acc, result) => acc + result.timeSpent, 0)
      const totalScore = updatedResults.reduce(
        (acc, result) =>
          acc + (result.isCorrectAnswered ? calculateQuestionScore(question.timeToAnswer, result.timeSpent) : 0),
        0,
      )
      const totalTimeToAnswer = task.questions.reduce((acc, question) => acc + question.timeToAnswer, 0)

      navigation.replace('FinishedTask', {
        task,
        results: { correctAnswers, totalScore, totalTimeSpent, totalTimeToAnswer },
      })
    }, 2000)
  }

  return (
    <>
      <ScrollView>
        <Box alignItems="center" padding={6}>
          <Text color="primary.700" fontWeight="600" fontSize="xl" textAlign="center">
            {question.statement}
          </Text>

          <VStack width="100%" marginTop={6} space={3}>
            {question.alternatives.map((alternative, alternativeIndex) =>
              !isShowingResults ? (
                <Pressable
                  key={`${alternative}-${alternativeIndex}`}
                  onPress={() => setSelectedAlternativeIndex(alternativeIndex)}
                >
                  <HStack alignItems="center" backgroundColor="card" borderRadius="16px" overflow="hidden">
                    <OctopusIcon
                      flexGrow={0}
                      minHeight="60px"
                      minWidth="60px"
                      marginRight={3}
                      borderLeftRadius={0}
                      backgroundColor={
                        selectedAlternativeIndex === alternativeIndex ? colors.primary[500] : colors.primary[200]
                      }
                    />
                    <Text flexShrink={1}>{alternative}</Text>
                  </HStack>
                </Pressable>
              ) : (
                <HStack
                  key={`${alternative}-${alternativeIndex}`}
                  alignItems="center"
                  backgroundColor="card"
                  borderRadius="16px"
                  overflow="hidden"
                >
                  <OctopusIcon
                    flexGrow={0}
                    minHeight="60px"
                    minWidth="60px"
                    marginRight={3}
                    borderLeftRadius={0}
                    backgroundColor={
                      alternativeIndex === question.rightAlternativeIndex
                        ? 'green.400'
                        : alternativeIndex === selectedAlternativeIndex
                        ? 'red.400'
                        : 'gray.300'
                    }
                  />
                  <Text flexShrink={1}>{alternative}</Text>
                </HStack>
              ),
            )}
          </VStack>
        </Box>
      </ScrollView>

      {!isShowingResults ? (
        <Button
          position="absolute"
          bottom="24px"
          left="32px"
          right="32px"
          isDisabled={selectedAlternativeIndex === null}
          onPress={onNextQuestion}
        >
          Próxima Questão
        </Button>
      ) : (
        <Box position="absolute" bottom="32px" left="32px" right="32px" alignItems="center">
          {selectedAlternativeIndex === question.rightAlternativeIndex ? (
            <>
              <HStack space={3} alignItems="center">
                <Icon as={Feather} color="green.500" name="check-circle" />
                <Text color="green.500" fontWeight="700" fontSize="xl">
                  Resposta Correta
                </Text>
              </HStack>

              <Text color="green.500" fontWeight="700" fontSize="xl">
                +{calculateQuestionScore(question.timeToAnswer, timeSpent)} pontos
              </Text>
            </>
          ) : (
            <HStack space={3} alignItems="center">
              <Icon as={Feather} color="red.500" name="x-circle" />
              <Text color="red.500" fontWeight="700" fontSize="xl">
                Resposta Incorreta
              </Text>
            </HStack>
          )}
        </Box>
      )}
    </>
  )
}
