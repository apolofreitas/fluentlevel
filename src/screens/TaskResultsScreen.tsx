import React, { useEffect } from 'react'
import { BackHandler } from 'react-native'
import { Box, Button, ScrollView, Text, VStack } from 'native-base'

import { RootScreen } from '~/types/navigation'
import { PartyingFace } from '~/assets'

export const TaskResultsScreen: RootScreen<'TaskResults'> = ({ navigation, route }) => {
  const { results } = route.params

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
                Tempo gasto: {results.totalTimeSpent} segundos
              </Text>
              <Text fontSize="lg" fontWeight="600">
                Questões corretas: {results.correctAnswers}
              </Text>
              <Text fontSize="lg" fontWeight="600">
                Pontuação total: {results.totalScore}
              </Text>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>

      <Button position="absolute" bottom="24px" left="32px" right="32px" onPress={() => navigation.navigate('Home')}>
        Finalizar
      </Button>
    </>
  )
}
