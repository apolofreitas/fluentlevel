import { Box, Button, HStack, Icon, Pressable, ScrollView, Text, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { AlternativeQuestionModel } from '~/api'
import { OctopusIcon } from '~/components'
import { calculateQuestionScore } from '~/utils/calculateQuestionScore'

interface AlternativeQuestionProps {
  question: AlternativeQuestionModel
  isShowingResults: boolean
  score: number
  timeSpent: number
  onCalculateScore: (score: number) => void
  onNextQuestion: () => void
}

export const AlternativeQuestion: React.FC<AlternativeQuestionProps> = ({
  question,
  isShowingResults,
  score,
  timeSpent,
  onCalculateScore,
  onNextQuestion,
}) => {
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState<number | null>(null)

  useEffect(() => {
    if (timeSpent < question.timeToAnswer) return
    handleCalculateScore()
  }, [timeSpent])

  const handleCalculateScore = () => {
    if (timeSpent >= question.timeToAnswer) onCalculateScore(0)
    if (question.rightAlternativeIndex !== selectedAlternativeIndex) return onCalculateScore(0)

    onCalculateScore(calculateQuestionScore(question.timeToAnswer, timeSpent))
  }

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
          onPress={handleCalculateScore}
        >
          Responder
        </Button>
      ) : (
        <VStack space={4} alignItems="center" position="absolute" bottom="24px" left="32px" right="32px">
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
          <Button width="100%" onPress={onNextQuestion}>
            Próxima Questão
          </Button>
        </VStack>
      )}
    </>
  )
}
