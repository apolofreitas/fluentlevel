import arrayShuffle from 'array-shuffle'
import { Box, Button, HStack, Icon, ScrollView, Text, useToast, View, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { runOnJS, runOnUI, useSharedValue } from 'react-native-reanimated'
import Feather from 'react-native-vector-icons/Feather'
import { OrganizeQuestionModel } from '~/api'
import { OrganizeQuestionLines } from './components/OrganizeQuestionLines'
import { OrganizeQuestionPlaceholders } from './components/OrganizeQuestionPlaceholders'
import { OrganizeQuestionWord } from './components/OrganizeQuestionWord'
import { calculateStringSimilarity } from '~/utils/calculateStringSimilarity'
import { getFilteredOffsets, getLayoutValues, layoutConstants, LayoutValues } from '~/utils/questionLayout'
import { showSimpleToast } from '~/utils/showSimpleToast'
import { OrganizeQuestionSortableWords } from './components/OrganizeQuestionSortableWords'
import { calculateQuestionScore } from '~/utils/calculateQuestionScore'

interface OrganizeQuestionProps {
  question: OrganizeQuestionModel
  isShowingResults: boolean
  score: number
  timeSpent: number
  onCalculateScore: (score: number) => void
  onNextQuestion: () => void
}

export const OrganizeQuestion: React.FC<OrganizeQuestionProps> = ({
  question,
  isShowingResults,
  score,
  timeSpent,
  onCalculateScore,
  onNextQuestion,
}) => {
  const toast = useToast()
  const [organizeAttempts, setOrganizeAttempts] = useState(3)
  const [organizedPhrase, setOrganizedPhrase] = useState('')

  const [words] = useState(
    arrayShuffle(
      (question.type === 'ORGANIZE_QUESTION' ? question.phraseToOrganize : '')
        .split(' ')
        .map((text, index) => ({ text, id: index })),
    ),
  )
  const [layoutValues, setLayoutValues] = useState<LayoutValues | null>(null)

  const offsets = words.map((children) => ({
    wordId: useSharedValue(children.id),
    order: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }))

  useEffect(() => {
    if (timeSpent < question.timeToAnswer) return
    handleCalculateScore()
  }, [timeSpent])

  useEffect(() => {
    if (organizedPhrase === '') return

    if (calculateStringSimilarity(question.phraseToOrganize, organizedPhrase) !== 1 && organizeAttempts > 1) {
      showSimpleToast(toast, 'Resposta incorreta')
      return setOrganizeAttempts((attempts) => attempts - 1)
    }

    handleCalculateScore()
  }, [organizedPhrase])

  const handleCalculateScore = () => {
    if (timeSpent >= question.timeToAnswer) onCalculateScore(0)

    if (calculateStringSimilarity(question.phraseToOrganize, organizedPhrase) !== 1) return onCalculateScore(0)

    onCalculateScore(calculateQuestionScore(question.timeToAnswer, timeSpent))
  }

  const calculateLayoutValues = () => getLayoutValues(offsets)

  const verifyOrganizedPhrase = () => {
    const filteredOffsets = getFilteredOffsets(offsets)
    setOrganizedPhrase(filteredOffsets.map((filteredOffsets) => words[filteredOffsets.wordId.value].text).join(' '))
  }

  return (
    <>
      <ScrollView>
        <Box paddingBottom={24}>
          <VStack space={2} paddingX={6} marginBottom={6}>
            <Text color="primary.700" fontWeight="600" fontSize="xl" textAlign="center">
              Traduza a frase abaixo:
            </Text>
            <Text fontWeight="600" fontSize="xl" textAlign="center">
              {question.translatedPhraseToOrganize}
            </Text>
            {!!isShowingResults && (
              <Text
                color={
                  organizedPhrase === question.phraseToOrganize
                    ? 'green.500'
                    : timeSpent >= question.timeToAnswer
                    ? 'primary.500'
                    : 'red.500'
                }
                fontWeight="600"
                fontSize="xl"
                textAlign="center"
                marginX={6}
                marginBottom={6}
              >
                {question.phraseToOrganize}
              </Text>
            )}
          </VStack>

          {!isShowingResults &&
            (!layoutValues ? (
              <HStack
                justifyContent="center"
                flexWrap="wrap"
                opacity="0"
                paddingX={`${layoutConstants.marginX}px`}
                paddingTop={`${layoutConstants.separatorHeight}px`}
              >
                {words.map((word, index) => {
                  const offset = offsets[index]!
                  const isLastOffset = index === offsets.length - 1

                  return (
                    <View
                      key={index}
                      onLayout={({
                        nativeEvent: {
                          layout: { x, y, width, height },
                        },
                      }) => {
                        offset.wordId.value = index
                        offset.order.value = -1
                        offset.width.value = width
                        offset.height.value = height
                        offset.originalX.value = x
                        offset.originalY.value = y

                        runOnUI(() => {
                          'worklet'

                          if (isLastOffset) {
                            runOnJS(setLayoutValues)(calculateLayoutValues)
                          }
                        })()
                      }}
                    >
                      <OrganizeQuestionWord key={word.id} id={word.id} word={word.text} />
                    </View>
                  )
                })}
              </HStack>
            ) : (
              <Box
                height={layoutValues.containerHeight}
                width={layoutValues.containerWidth}
                marginX={`${layoutValues.marginX}px`}
              >
                <OrganizeQuestionLines layoutValues={layoutValues} />
                <OrganizeQuestionPlaceholders layoutValues={layoutValues} offsets={offsets} />
                <OrganizeQuestionSortableWords layoutValues={layoutValues} offsets={offsets} words={words} />
              </Box>
            ))}
        </Box>
      </ScrollView>

      {!isShowingResults ? (
        <Box position="absolute" bottom="24px" left="32px" right="32px">
          <Text color="primary.700" fontWeight="600" padding={2}>
            Tentativas: {organizeAttempts}
          </Text>
          <Button
            isDisabled={
              !offsets.some(({ order }) => order.value !== -1) || offsets.every(({ order }) => order.value === 0)
            }
            width="100%"
            onPress={verifyOrganizedPhrase}
          >
            Responder
          </Button>
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
          ) : timeSpent >= question.timeToAnswer ? (
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
