import { Box, Button, HStack, Icon, Input, ScrollView, Text, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { ListenQuestionModel } from '~/api'
import { PlayAudioButton } from '~/components'
import { calculateQuestionScore } from '~/utils/calculateQuestionScore'
import { calculateStringSimilarity } from '~/utils/calculateStringSimilarity'

interface ListenQuestionProps {
  question: ListenQuestionModel
  isShowingResults: boolean
  score: number
  timeSpent: number
  onCalculateScore: (score: number) => void
  onNextQuestion: () => void
}

export const ListenQuestion: React.FC<ListenQuestionProps> = ({
  question,
  isShowingResults,
  score,
  timeSpent,
  onCalculateScore,
  onNextQuestion,
}) => {
  const [recognizedText, setRecognizedText] = useState('')

  useEffect(() => {
    if (timeSpent < question.timeToAnswer) return
    handleCalculateScore()
  }, [timeSpent])

  const handleCalculateScore = () => {
    if (timeSpent >= question.timeToAnswer) onCalculateScore(0)
    if (calculateStringSimilarity(question.phraseToRecognize, recognizedText) < 0.95) return onCalculateScore(0)

    onCalculateScore(calculateQuestionScore(question.timeToAnswer, timeSpent))
  }

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
          onPress={handleCalculateScore}
        >
          Responder
        </Button>
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
