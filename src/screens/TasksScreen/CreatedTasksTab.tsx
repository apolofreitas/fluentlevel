import React from 'react'
import { useNavigation } from '@react-navigation/core'
import { Box, Text, Fab, Icon, VStack, ScrollView, HStack, Spacer, Pressable, Center } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { HomeScreen } from '~/types/navigation'
import { useCreatedTasks } from '~/hooks'
import { LoadingScreen } from '~/screens/LoadingScreen'
import { Alert } from 'react-native'

export const CreatedTasksTab: HomeScreen<'Tasks'> = ({ navigation }) => {
  const { createdTasks, isLoading } = useCreatedTasks()

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Fab
        renderInPortal={false}
        right={4}
        bottom={4}
        icon={<Icon as={Feather} name="plus" />}
        onPress={() => navigation.navigate('SaveTask')}
      />

      <ScrollView>
        <Box paddingX={6} paddingY={4}>
          <VStack space={4}>
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
                          text: 'Abrir',
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
                      ellipsizeMode="tail"
                      textAlign="justify"
                      fontSize="lg"
                      fontWeight="700"
                      color="primary.500"
                    >
                      {task.title}
                    </Text>
                    <Text marginBottom={2} color="primary.700">
                      {task.questions.length} questões
                    </Text>
                    {!!task.description && <Text>{task.description}</Text>}
                  </Box>
                </Pressable>
              ))
            )}
          </VStack>
        </Box>
      </ScrollView>
    </>
  )
}
