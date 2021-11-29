import { Box, Button, HStack, Icon, ScrollView, Text, useToast, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { SpeechQuestionModel } from '~/api'
import { PlayAudioButton, RecognizeAudioButton } from '~/components'
import { calculateQuestionScore } from '~/utils/calculateQuestionScore'
import { calculateStringSimilarity } from '~/utils/calculateStringSimilarity'
import { showSimpleToast } from '~/utils/showSimpleToast'

interface SpeechQuestionProps {
  question: SpeechQuestionModel
  isShowingResults: boolean
  score: number
  timeSpent: number
  onCalculateScore: (score: number) => void
  onNextQuestion: () => void
}

export const SpeechQuestion: React.FC<SpeechQuestionProps> = ({
  question,
  isShowingResults,
  score,
  timeSpent,
  onCalculateScore,
  onNextQuestion,
}) => {
  const toast = useToast()
  const [speechAttempts, setSpeechAttempts] = useState(3)
  const [speechTexts, setSpeechTexts] = useState<string[]>([])

  useEffect(() => {
    if (speechTexts.length === 0) return

    if (
      !speechTexts.some((speechText) => calculateStringSimilarity(question.phraseToSpeech, speechText) === 1) &&
      speechAttempts > 1
    ) {
      showSimpleToast(toast, 'Resposta incorreta')
      return setSpeechAttempts((attempts) => attempts - 1)
    }

    handleCalculateScore()
  }, [speechTexts])

  useEffect(() => {
    if (timeSpent < question.timeToAnswer) return
    handleCalculateScore()
  }, [timeSpent])

  const handleCalculateScore = () => {
    if (timeSpent >= question.timeToAnswer) onCalculateScore(0)

    if (!speechTexts.some((speechText) => calculateStringSimilarity(question.phraseToSpeech, speechText) === 1)) {
      return onCalculateScore(0)
    }

    onCalculateScore(calculateQuestionScore(question.timeToAnswer, timeSpent))
  }

  return (
    <>
      <ScrollView>
        <VStack space={6} alignItems="center" padding={6} paddingBottom={24}>
          <Text color="primary.700" fontWeight="600" fontSize="xl" textAlign="center">
            Pronuncie o texto abaixo:
          </Text>

          <VStack space={4} alignItems="center" width="100%">
            <Text color="primary.700" fontSize="xl" fontWeight="700" textTransform="capitalize">
              {question.phraseToSpeech}
            </Text>
            {isShowingResults && <PlayAudioButton width="100%" locale="en-US" textToSpeech={question.phraseToSpeech} />}
          </VStack>
        </VStack>
      </ScrollView>

      {!isShowingResults ? (
        <Box position="absolute" bottom="24px" left="32px" right="32px">
          <HStack alignItems="flex-end" justifyContent="space-between" padding={2}>
            <Text color="primary.700" fontWeight="600">
              Tentativas: {speechAttempts}
            </Text>
            <Text underline color="primary.500" fontSize="sm" fontWeight="600" onPress={onNextQuestion}>
              Não posso falar
            </Text>
          </HStack>
          <RecognizeAudioButton locale="en-US" onRecognize={(...texts) => setSpeechTexts(texts)} />
        </Box>
      ) : (
        <VStack space={4} alignItems="center" position="absolute" bottom="24px" left="32px" right="32px">
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
          ) : timeSpent >= question.timeToAnswer && speechTexts.length === 0 ? (
            <HStack space={3} alignItems="center">
              <Icon as={Feather} color="primary.500" name="clock" />
              <Text color="primary.500" fontWeight="700" fontSize="xl">
                Tempo esgotado
              </Text>
            </HStack>
          ) : (
            <HStack space={3} alignItems="center">
              <Icon as={Feather} color="red.500" name="x-circle" />
              <Text color="red.500" fontWeight="700" fontSize="xl">
                Resposta Incorreta
              </Text>
            </HStack>
          )}
          <Button width="100%" onPress={onNextQuestion}>
            Próxima Questão
          </Button>
        </VStack>
      )}
    </>
  )
}
