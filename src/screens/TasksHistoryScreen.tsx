import React from 'react'
import { Box, HStack, Pressable, ScrollView, Text, VStack } from 'native-base'
import dateFormat from 'dateformat'

import { RootScreen } from '~/types/navigation'
import { useCurrentUser, useTasks } from '~/hooks'

export const TasksHistoryScreen: RootScreen<'TasksHistory'> = ({ navigation }) => {
  const { currentUser } = useCurrentUser()
  const { tasks } = useTasks()

  return (
    <ScrollView>
      <VStack paddingX={5} paddingY={3} space={2}>
        {currentUser.tasksHistory.map(({ taskId, task, totalScore, submittedAt }) => (
          <Pressable
            key={taskId}
            onPress={async () => {
              const task = tasks.find(({ id }) => id === taskId)
              if (!task) return
              navigation.navigate('TaskDetails', { task })
            }}
          >
            <Box backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
              <Text flexShrink={1} isTruncated textAlign="justify" fontSize="lg" fontWeight="700" color="primary.500">
                {task.title}
              </Text>

              <HStack justifyContent="space-between">
                <Text fontWeight="700" color="primary.700">
                  {totalScore} pontos
                </Text>
                <Text color="gray.500">{dateFormat(submittedAt.toDate(), 'dd/mm/yyyy')}</Text>
              </HStack>
            </Box>
          </Pressable>
        ))}
      </VStack>
    </ScrollView>
  )
}
