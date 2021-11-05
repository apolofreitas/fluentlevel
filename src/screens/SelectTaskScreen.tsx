import React, { useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { Box, Button, HStack, Icon, Input, Pressable, ScrollView, Spacer, Text, VStack } from 'native-base'

import { useTasks } from '~/hooks/useTasks'
import { RootScreen } from '~/types/navigation'
import { calculateStringSimilarity } from '~/utils/calculateStringSimilarity'
import { Task } from '~/api'

export const SelectTaskScreen: RootScreen<'SelectTask'> = ({ navigation }) => {
  const { tasks } = useTasks()
  const [search, setSearch] = useState('')
  const [filteredTasks, setFilteredTasks] = useState(tasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    setFilteredTasks(
      tasks
        .filter((filteredTask) => {
          if (!search) return true

          if (search[0] === '@') {
            return `@${filteredTask.author.username.toLocaleLowerCase()}`.includes(search.toLocaleLowerCase())
          }

          return (
            filteredTask.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            (filteredTask.description || '').toLocaleLowerCase().includes(search.toLocaleLowerCase())
          )
        })
        .sort((a, b) => {
          if (!search) return 0

          const similarityA = Math.max(
            calculateStringSimilarity(a.title, search),
            calculateStringSimilarity(a.description || '', search),
            calculateStringSimilarity(`@${a.author.username}`, search),
          )
          const similarityB = Math.max(
            calculateStringSimilarity(b.title, search),
            calculateStringSimilarity(b.description || '', search),
            calculateStringSimilarity(`@${b.author.username}`, search),
          )

          return similarityB - similarityA
        }),
    )
  }, [search, tasks])

  return (
    <>
      <ScrollView>
        <Box paddingX={6} paddingY={4}>
          <Input
            flex={1}
            size="sm"
            height={10}
            placeholder="Pesquisar"
            value={search}
            onChangeText={setSearch}
            paddingLeft={0}
            InputLeftElement={<Icon as={Feather} name="search" size="sm" color="primary.500" margin={3} />}
            marginBottom={4}
          />

          <VStack space={3}>
            {filteredTasks.map((task) => {
              return (
                <Pressable key={task.id} onPress={() => setSelectedTask(task)}>
                  <Box
                    backgroundColor="card"
                    borderRadius="16px"
                    paddingX={4}
                    paddingY={3}
                    borderWidth={2}
                    borderColor={task.id === selectedTask?.id ? 'primary.500' : 'transparent'}
                  >
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

                    <HStack marginBottom={1}>
                      <Text color="primary.700">@{task.author.username}</Text>
                      <Spacer />
                      <Text color="primary.700">{task.questions.length} questões</Text>
                    </HStack>

                    {!!task.description && (
                      <Text isTruncated numberOfLines={2} textAlign="justify">
                        {task.description}
                      </Text>
                    )}
                  </Box>
                </Pressable>
              )
            })}
          </VStack>
        </Box>
      </ScrollView>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        isDisabled={!selectedTask}
        onPress={() => navigation.navigate('SaveContest', { taskToSelect: selectedTask })}
      >
        Selecionar
      </Button>
    </>
  )
}
