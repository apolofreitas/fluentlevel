import React, { useEffect, useState } from 'react'
import { Box, VStack, ScrollView, HStack, Text, Spacer, Input, Icon, Pressable } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { HomeScreen } from '~/types/navigation'
import { Task } from '~/api'
import { useCommunityTasks } from '~/hooks'
import { LoadingScreen } from '~/screens/LoadingScreen'

export const CommunityTasksTab: HomeScreen<'Tasks'> = ({ navigation }) => {
  const [search, setSearch] = useState('')
  const { communityTasks, isLoading } = useCommunityTasks()
  const [filteredCommunityTasks, setFilteredCommunityTasks] = useState<Task[] | null>(
    communityTasks.length > 0 ? communityTasks : null,
  )

  useEffect(() => {
    setFilteredCommunityTasks(
      communityTasks.filter(
        (communityTask) =>
          communityTask.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          (communityTask.description || '').toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          `@${communityTask.author.username.toLocaleLowerCase()}`.match(search.toLocaleLowerCase()),
      ),
    )
  }, [search, communityTasks])

  if (isLoading || filteredCommunityTasks === null) return <LoadingScreen />

  return (
    <ScrollView>
      <Box paddingX={6} paddingY={4}>
        <HStack space={2} alignItems="center" marginBottom={4}>
          <Input
            flex={1}
            size="sm"
            height={10}
            placeholder="Pesquisar"
            value={search}
            onChangeText={setSearch}
            paddingLeft={0}
            InputLeftElement={<Icon as={Feather} name="search" size="sm" margin={3} />}
          />
        </HStack>

        <VStack space={4}>
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
                      ellipsizeMode="tail"
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
            })
          )}
        </VStack>
      </Box>
    </ScrollView>
  )
}
