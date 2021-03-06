import React from 'react'
import { Box, Text, Fab, Icon, VStack, ScrollView, Pressable } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { TasksScreen } from '~/types/navigation'
import { useTasks } from '~/hooks'
import { LoadingScreen } from '~/screens/LoadingScreen'
import { Alert } from 'react-native'

export const CreatedTasksScreen: TasksScreen<'CreatedTasks'> = ({ navigation }) => {
  const { createdTasks, isLoading } = useTasks()

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <ScrollView>
        <Box paddingX={6} paddingY={4}>
          <VStack space={3}>
            {createdTasks.length === 0 ? (
              <Text textAlign="center" fontWeight="600">
                Ainda não tem nada por aqui.
              </Text>
            ) : (
              createdTasks.map((task) => (
                <Pressable
                  key={task.id}
                  onPress={() => {
                    Alert.alert(
                      task.title,
                      task.description,
                      [
                        {
                          text: 'Cancelar',
                          style: 'cancel',
                        },
                        {
                          text: 'Editar',
                          onPress: () => navigation.navigate('SaveTask', { initialValues: task }),
                        },
                        {
                          text: 'Começar',
                          onPress: () => navigation.navigate('TaskDetails', { task }),
                        },
                      ],
                      {
                        cancelable: true,
                      },
                    )
                  }}
                >
                  <Box backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
                    <Text
                      flexShrink={1}
                      isTruncated
                      textAlign="justify"
                      fontSize="lg"
                      fontWeight="700"
                      color="primary.500"
                    >
                      {task.title}
                    </Text>

                    <Text color="primary.700">{task.questions.length} questões</Text>

                    {!!task.description && (
                      <Text isTruncated numberOfLines={2} textAlign="justify">
                        {task.description}
                      </Text>
                    )}
                  </Box>
                </Pressable>
              ))
            )}
          </VStack>
        </Box>
      </ScrollView>

      <Fab
        renderInPortal={false}
        right={4}
        bottom={4}
        icon={<Icon as={Feather} name="plus" />}
        onPress={() => navigation.navigate('SaveTask')}
      />
    </>
  )
}
