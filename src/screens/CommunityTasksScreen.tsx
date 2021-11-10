import React, { useEffect, useState } from 'react'
import { Box, VStack, ScrollView, HStack, Text, Spacer, Input, Icon, Pressable } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { TasksScreen } from '~/types/navigation'
import { Task } from '~/api'
import { useTasks } from '~/hooks'
import { LoadingScreen } from '~/screens/LoadingScreen'
import { calculateStringSimilarity } from '~/utils/calculateStringSimilarity'

export const CommunityTasksScreen: TasksScreen<'CommunityTasks'> = ({ navigation }) => {
  const [search, setSearch] = useState('')
  const { communityTasks, isLoading } = useTasks()
  const [filteredCommunityTasks, setFilteredCommunityTasks] = useState<Task[] | null>(
    communityTasks.length > 0 ? communityTasks : null,
  )

  useEffect(() => {
    setFilteredCommunityTasks(
      communityTasks
        .filter((communityTask) => {
          if (!search) return true

          if (search[0] === '@') {
            return `@${communityTask.author.username.toLocaleLowerCase()}`.includes(search.toLocaleLowerCase())
          }

          return (
            communityTask.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            (communityTask.description || '').toLocaleLowerCase().includes(search.toLocaleLowerCase())
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
  }, [search, communityTasks])

  if (isLoading || filteredCommunityTasks === null) return <LoadingScreen />

  return (
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
          {filteredCommunityTasks.length === 0 ? (
            <Text>Foi mal, não conseguimos encontrar nenhum resultado.</Text>
          ) : (
            filteredCommunityTasks.map((task) => {
              return (
                <Pressable key={task.id} onPress={() => navigation.navigate('TaskDetails', { task })}>
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

                    <HStack>
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
            })
          )}
        </VStack>
      </Box>
    </ScrollView>
  )
}
