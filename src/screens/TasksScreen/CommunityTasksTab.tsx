import * as React from 'react'
import { Box, VStack, ScrollView, HStack, Text, Spacer, Input, Button, Icon } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { Task } from '~/api'
import { useCommunityTasks } from '~/hooks'
import { LoadingScreen } from '~/screens/LoadingScreen'

export const CommunityTasksTab = () => {
  const [search, setSearch] = React.useState('')
  const [filteredCommunityTasks, setFilteredCommunityTasks] = React.useState<Task[]>([])
  const { communityTasks, isLoading } = useCommunityTasks()

  React.useEffect(() => {
    setFilteredCommunityTasks(
      communityTasks.filter(
        (communityTask) =>
          communityTask.title.includes(search) ||
          communityTask.description.includes(search) ||
          `@${communityTask.author.username}`.match(search),
      ),
    )
  }, [search, communityTasks])

  if (isLoading) return <LoadingScreen />

  return (
    <ScrollView>
      <Box paddingX={6} paddingY={4}>
        <HStack space={2} alignItems="center" marginBottom={4}>
          <Input flex={1} size="sm" height={10} placeholder="Pesquisar" value={search} onChangeText={setSearch} />
          <Button
            height="100%"
            padding={2}
            startIcon={<Icon as={Feather} name="search" color="lightText" size="sm" />}
          />
        </HStack>

        <VStack space={4}>
          {filteredCommunityTasks.map((task) => (
            <Box key={task.id} backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
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
                <Text color="primary.700">@{task.author.username}</Text>
                <Spacer />
                <Text color="primary.700">{task.questions.length} questões</Text>
              </HStack>

              <Text isTruncated numberOfLines={3} textAlign="justify">
                {task.description}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </ScrollView>
  )
}
