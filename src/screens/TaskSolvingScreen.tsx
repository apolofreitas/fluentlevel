import React, { useEffect, useState } from 'react'
import { Alert, BackHandler } from 'react-native'
import { Box, Button, HStack, Icon, Input, Pressable, ScrollView, Text, useToast, VStack } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { RootScreen } from '~/types/navigation'
import { OctopusIcon, PlayAudioButton, RecognizeAudioButton } from '~/components'
import { calculateQuestionScore } from '~/utils/calculateQuestionScore'
import { formatTime } from '~/utils/formatTime'
import { calculateStringSimilarity } from '~/utils/calculateStringSimilarity'
import { showSimpleToast } from '~/utils'

export const TaskSolvingScreen: RootScreen<'TaskSolving'> = ({ navigation, route }) => {
  const toast = useToast()
  const { task, results, questionIndex } = route.params
  const question = task.questions[questionIndex]
  const [score, setScore] = useState<number | null>(null)
  const [isShowingResults, setIsShowingResults] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState<number | null>(null)

  const [recognizedText, setRecognizedText] = useState('')

  const [speechAttempts, setSpeechAttempts] = useState(3)
  const [speechText, setSpeechText] = useState('')

  useEffect(() => {
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

  useEffect(() => {
    if (isShowingResults) return

    const timeSpentIntervalId = setInterval(() => {
      setTimeSpent((timeSpent) => timeSpent + 1)
    }, 1000)

    return () => clearInterval(timeSpentIntervalId)
  }, [isShowingResults])

  useEffect(() => {
    navigation.setOptions({ title: `Tempo: ${formatTime(question.timeToAnswer - timeSpent)}` })
    if (timeSpent === question.timeToAnswer) calculateScore()
  }, [timeSpent])

  useEffect(() => {
    if (isShowingResults) return
    if (score === null) return

    setIsShowingResults(true)
  }, [score, isShowingResults])

  useEffect(() => {
    if (question.type !== 'SPEECH_QUESTION') return
    if (speechText === '') return

    if (calculateStringSimilarity(question.phraseToSpeech, speechText) !== 1 && speechAttempts > 1) {
      showSimpleToast(toast, 'Resposta incorreta')
      return setSpeechAttempts((attempts) => attempts - 1)
    }

    calculateScore()
  }, [speechText])

  const calculateScore = () => {
    if (question.type === 'ALTERNATIVE_QUESTION') {
      if (question.rightAlternativeIndex === selectedAlternativeIndex) {
        setScore(calculateQuestionScore(question.timeToAnswer, timeSpent))
      } else {
        setScore(0)
      }
    } else if (question.type === 'LISTEN_QUESTION') {
      const answerSimilarity = calculateStringSimilarity(question.phraseToRecognize, recognizedText)
      if (answerSimilarity >= 0.95) {
        setScore(calculateQuestionScore(question.timeToAnswer, timeSpent, answerSimilarity))
      } else {
        setScore(0)
      }
    } else if (question.type === 'SPEECH_QUESTION') {
      if (calculateStringSimilarity(question.phraseToSpeech, speechText) === 1) {
        setScore(calculateQuestionScore(question.timeToAnswer, timeSpent))
      } else {
        setScore(0)
      }
    } else if (question.type === 'ORGANIZE_QUESTION') {
      setScore(0)
    }
  }

  const goToNextScreen = () => {
    if (!navigation.isFocused()) return

    const updatedResults = [...results, { timeSpent, isCorrectAnswered: !!score }]

    if (questionIndex < task.questions.length - 1) {
      navigation.replace('TaskSolving', {
        task,
        questionIndex: questionIndex + 1,
        results: updatedResults,
      })
    } else {
      const correctAnswers = updatedResults.reduce((acc, result) => acc + (result.isCorrectAnswered ? 1 : 0), 0)
      const totalTimeSpent = updatedResults.reduce((acc, result) => acc + result.timeSpent, 0)
      const totalScore = updatedResults.reduce((acc, result) => acc + (result.isCorrectAnswered ? score || 0 : 0), 0)
      const totalTimeToAnswer = task.questions.reduce((acc, question) => acc + question.timeToAnswer, 0)

      navigation.replace('TaskResults', {
        task,
        results: { correctAnswers, totalScore, totalTimeSpent, totalTimeToAnswer },
      })
    }
  }

  if (question.type === 'ALTERNATIVE_QUESTION') {
    return (
      <>
        <ScrollView>
          <Box alignItems="center" padding={6} paddingBottom={24}>
            {!!question.info && (
              <Text color="primary.700" fontWeight="600" fontSize="xl" textAlign="center">
                {question.info}
              </Text>
            )}

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
                        backgroundColor={selectedAlternativeIndex === alternativeIndex ? 'primary.500' : 'gray.300'}
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
            onPress={calculateScore}
          >
            Próxima Questão
          </Button>
        ) : (
          <VStack space={4} alignItems="center" position="absolute" bottom="32px" left="32px" right="32px">
            {selectedAlternativeIndex === question.rightAlternativeIndex ? (
              <Box alignItems="center">
                <HStack space={3} alignItems="center">
                  <Icon as={Feather} color="green.500" name="check-circle" />
                  <Text color="green.500" fontWeight="700" fontSize="xl">
                    Resposta Correta
                  </Text>
                </HStack>

                <Text color="green.500" fontWeight="700" fontSize="xl">
                  +{score} pontos
                </Text>
              </Box>
            ) : (
              <HStack space={3} alignItems="center">
                <Icon as={Feather} color="red.500" name="x-circle" />
                <Text color="red.500" fontWeight="700" fontSize="xl">
                  Resposta Incorreta
                </Text>
              </HStack>
            )}
            <Button width="100%" onPress={goToNextScreen}>
              Próxima Questão
            </Button>
          </VStack>
        )}
      </>
    )
  }

  if (question.type === 'LISTEN_QUESTION') {
    return (
      <>
        <ScrollView>
          <VStack space={6} alignItems="center" padding={6} paddingBottom={24}>
            <Text color="primary.700" fontWeight="600" fontSize="xl" textAlign="center">
              {question.info}
              Digite corretamente o que reconhecer no áudio
            </Text>

            <PlayAudioButton width="100%" locale="en-US" textToSpeech={question.phraseToRecognize} />

            <VStack space={2} alignItems="center" width="100%">
              <Input
                width="100%"
                placeholder="Digite o texto do áudio"
                value={recognizedText}
                onChangeText={setRecognizedText}
                isDisabled={isShowingResults}
                borderWidth={2}
                borderColor={isShowingResults ? (!!score ? 'green.500' : 'red.500') : 'transparent'}
                color={isShowingResults ? (!!score ? 'green.600' : 'red.600') : undefined}
                textAlign={isShowingResults ? 'center' : undefined}
                fontWeight={isShowingResults ? '600' : undefined}
              />
              {isShowingResults && !score && (
                <Text textTransform="capitalize" fontSize="lg" fontWeight="700">
                  {question.phraseToRecognize}
                </Text>
              )}
            </VStack>
          </VStack>
        </ScrollView>

        {!isShowingResults ? (
          <Button
            position="absolute"
            bottom="24px"
            left="32px"
            right="32px"
            isDisabled={!recognizedText}
            onPress={calculateScore}
          >
            Próxima Questão
          </Button>
        ) : (
          <VStack space={4} alignItems="center" position="absolute" bottom="32px" left="32px" right="32px">
            {!!score ? (
              <Box alignItems="center">
                <HStack space={3} alignItems="center">
                  <Icon as={Feather} color="green.500" name="check-circle" />
                  <Text color="green.500" fontWeight="700" fontSize="xl">
                    Resposta Correta
                  </Text>
                </HStack>

                <Text color="green.500" fontWeight="700" fontSize="xl">
                  +{score} pontos
                </Text>
              </Box>
            ) : (
              <HStack space={3} alignItems="center">
                <Icon as={Feather} color="red.500" name="x-circle" />
                <Text color="red.500" fontWeight="700" fontSize="xl">
                  Resposta Incorreta
                </Text>
              </HStack>
            )}
            <Button width="100%" onPress={goToNextScreen}>
              Próxima Questão
            </Button>
          </VStack>
        )}
      </>
    )
  }

  if (question.type === 'SPEECH_QUESTION') {
    return (
      <>
        <ScrollView>
          <VStack space={6} alignItems="center" padding={6} paddingBottom={24}>
            <Text color="primary.700" fontWeight="600" fontSize="xl" textAlign="center">
              {question.info}
              Pronuncie corretamente o texto abaixo:
            </Text>

            <VStack space={4} alignItems="center" width="100%">
              <Text color="primary.700" fontSize="xl" fontWeight="700" textTransform="capitalize">
                {question.phraseToSpeech}
              </Text>
              {isShowingResults && (
                <PlayAudioButton width="100%" locale="en-US" textToSpeech={question.phraseToSpeech} />
              )}
            </VStack>
          </VStack>
        </ScrollView>

        {!isShowingResults ? (
          <Box position="absolute" bottom="24px" left="32px" right="32px">
            <HStack alignItems="flex-end" justifyContent="space-between" padding={2}>
              <Text color="primary.700" fontWeight="600">
                Tentativas: {speechAttempts}
              </Text>
              <Text underline color="primary.500" fontSize="sm" fontWeight="600" onPress={goToNextScreen}>
                Não posso falar
              </Text>
            </HStack>
            <RecognizeAudioButton locale="en-US" onRecognize={setSpeechText} />
          </Box>
        ) : (
          <VStack space={4} alignItems="center" position="absolute" bottom="32px" left="32px" right="32px">
            {!!score ? (
              <Box alignItems="center">
                <HStack space={3} alignItems="center">
                  <Icon as={Feather} color="green.500" name="check-circle" />
                  <Text color="green.500" fontWeight="700" fontSize="xl">
                    Resposta Correta
                  </Text>
                </HStack>

                <Text color="green.500" fontWeight="700" fontSize="xl">
                  +{score} pontos
                </Text>
              </Box>
            ) : (
              <HStack space={3} alignItems="center">
                <Icon as={Feather} color="red.500" name="x-circle" />
                <Text color="red.500" fontWeight="700" fontSize="xl">
                  Resposta Incorreta
                </Text>
              </HStack>
            )}
            <Button width="100%" onPress={goToNextScreen}>
              Próxima Questão
            </Button>
          </VStack>
        )}
      </>
    )
  }

  return null
}
