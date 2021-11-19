import React from 'react'
import { Box, Button, HStack, ScrollView, Text, VStack } from 'native-base'

import { RootScreen } from '~/types/navigation'

export const TaskDetailsScreen: RootScreen<'TaskDetails'> = ({ navigation, route }) => {
  const { task } = route.params

  return (
    <>
      <ScrollView>
        <Box paddingX={8} paddingY={2} paddingBottom={24}>
          <Text color="primary.500" fontSize="4xl" fontWeight="700" marginBottom={2}>
            {task.title}
          </Text>

          <HStack width="100%" justifyContent="space-between" marginBottom={6}>
            <Text fontSize="lg" fontWeight="600" color="primary.700">
              @{task.author.username}
            </Text>
            <Text fontSize="lg" fontWeight="600">
              {task.questions.length > 1 ? `${task.questions.length} questões` : `${task.questions.length} questão`}
            </Text>
          </HStack>

          {task.description && (
            <Box width="100%" backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
              <Text color="gray.500">{task.description}</Text>
            </Box>
          )}
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
