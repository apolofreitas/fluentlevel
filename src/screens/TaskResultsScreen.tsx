import React, { useEffect, useMemo, useState } from 'react'
import { BackHandler } from 'react-native'
import { Box, Button, ScrollView, Text, VStack } from 'native-base'

import { RootScreen } from '~/types/navigation'
import { PartyingFace } from '~/assets'
import { submitScore } from '~/api'

export const TaskResultsScreen: RootScreen<'TaskResults'> = ({ navigation, route }) => {
  const { contestId, results } = route.params
  const submitting = useMemo(() => submitScore({ results, contestId }), [contestId, results])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home')
      return true
    })

    return () => backHandler.remove()
  }, [])

  return (
    <>
      <ScrollView>
        <Box flex={1} alignItems="center" padding={9} paddingBottom={24}>
          <VStack width="100%" space={5}>
            <PartyingFace alignSelf="center" />

            <Text alignSelf="center" fontSize="4xl" fontWeight="700" color="primary.700">
              Tarefa Concluída
            </Text>

            <VStack space={1}>
              <Text fontSize="lg" fontWeight="600">
                Tempo gasto: {results.timeSpent} segundos
              </Text>
              <Text fontSize="lg" fontWeight="600">
                Questões corretas: {results.correctQuestionsAmount}
              </Text>
              <Text fontSize="lg" fontWeight="600">
                Pontuação total: {results.totalScore}
              </Text>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        isLoading={isLoading}
        onPress={async () => {
          setIsLoading(true)
          await submitting
          navigation.navigate('Home')
        }}
      >
        Finalizar
      </Button>
    </>
  )
}
