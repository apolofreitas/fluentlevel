import * as React from 'react'
import { Box, Button, HStack, ScrollView, Text, VStack } from 'native-base'

import { RootScreen } from '~/types/navigation'

export const TaskDetailsScreen: RootScreen<'TaskDetails'> = ({ navigation, route }) => {
  const { task } = route.params

  return (
    <>
      <ScrollView>
        <Box alignItems="center" padding={8}>
          <VStack width="100%" marginTop={4} space={6}>
            <Text fontSize="4xl" fontWeight="700">
              {task.title}
            </Text>

            <Text fontSize="lg" color="gray.500">
              {task.description}
            </Text>

            <HStack width="100%" justifyContent="space-between">
              <Text fontSize="lg" fontWeight="600">
                {task.questions.length > 1 ? `${task.questions.length} questões` : `${task.questions.length} questão`}
              </Text>
              <Text fontSize="lg" color="primary.700">
                @{task.author.username}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        onPress={() => navigation.navigate('TaskSolving', { task, questionIndex: 0, results: [] })}
      >
        Começar
      </Button>
    </>
  )
}
