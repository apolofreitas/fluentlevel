import * as React from 'react'
import { useNavigation } from '@react-navigation/core'
import { Box, Text, Fab, Icon, VStack, ScrollView, HStack, Spacer, Pressable, Center } from 'native-base'

import Feather from 'react-native-vector-icons/Feather'
import { useCreatedTasks } from '~/hooks'
import { LoadingScreen } from '~/screens/LoadingScreen'

export const CreatedTasksTab = () => {
  const navigation = useNavigation()
  const { createdTasks, isLoading } = useCreatedTasks()

  if (isLoading) return <LoadingScreen />

  if (createdTasks.length === 0)
    return (
      <Center>
        <Text textAlign="center" fontWeight="600">
          Ainda não tem nada por aqui.
        </Text>
      </Center>
    )

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
            {createdTasks.map((task) => (
              <Pressable
                key={task.id}
                onPress={() =>
                  navigation.navigate('SaveTask', {
                    initialValues: task,
                  })
                }
              >
                <Box backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
                  <Text
                    flexShrink={1}
                    isTruncated
                    numberOfLines={2}
                    textAlign="justify"
                    fontSize="lg"
                    fontWeight="700"
                    color="primary.500"
                  >
                    {task.title}
                  </Text>

                  <HStack marginBottom={2}>
                    <Spacer />
                    <Text color="primary.700">{task.questions.length} questões</Text>
                  </HStack>

                  <Text>{task.description}</Text>
                </Box>
              </Pressable>
            ))}
          </VStack>
        </Box>
      </ScrollView>
    </>
  )
}
