import * as React from 'react'
import { Box, HStack, ScrollView, Text, VStack } from 'native-base'
import { useUser } from '~/hooks/useUser'
import { Profile } from '~/assets'

export function ProfileScreen() {
  const user = useUser()

  return (
    <ScrollView>
      <Box paddingX={5} paddingY={2}>
        <HStack space={3} alignItems="center" marginX={2} marginBottom={4}>
          <Profile height={80} width={80} />

          <Box>
            <Text fontWeight="600" fontSize="xl">
              {user.nickname}
            </Text>
            <Text fontWeight="600" color="primary.500">
              @{user.username}
            </Text>

            <HStack space={2}>
              <Text fontWeight="600" color="gray.600">
                {user.followers.length} seguidores
              </Text>
              <Text fontWeight="600" color="gray.600">
                {user.following.length} seguindo
              </Text>
            </HStack>
          </Box>
        </HStack>

        <Box backgroundColor="card" borderWidth={1} borderColor="gray.100" borderRadius="16px" marginBottom={4}>
          <VStack space={2} paddingX={4} paddingY={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="xl" fontWeight="700" color="primary.500">
                Pontuação total
              </Text>
              <Text color="primary.500">{user.tasksScore + user.contestsScore} pontos</Text>
            </HStack>

            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="600">Tarefas</Text>
              <Text color="gray.500">{user.tasksScore} pontos</Text>
            </HStack>

            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="600">Competições</Text>
              <Text color="gray.500">{user.contestsScore} pontos</Text>
            </HStack>
          </VStack>
        </Box>

        <Text fontSize="xl" fontWeight="700" marginLeft={1} marginBottom={2}>
          Histórico
        </Text>

        <Box backgroundColor="card" borderWidth={1} borderColor="gray.100" borderRadius="16px" marginBottom={2}>
          <VStack space={2} paddingX={4} paddingY={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="700" color="primary.500">
                {user.tasksHistory.length === 0 ? (
                  <>Nenhuma tarefa concluída</>
                ) : (
                  <>{user.tasksHistory.length} tarefas concluídas</>
                )}
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.500">
                {user.tasksScore} pontos
              </Text>
            </HStack>

            <Text fontWeight="400" color="gray.500">
              Aqui você poderá ver todas as tarefas já feitas por você.
            </Text>

            <Text alignSelf="flex-end" fontSize="sm" fontWeight="400" color="primary.500">
              Exibir mais
            </Text>
          </VStack>
        </Box>

        <Box backgroundColor="card" borderWidth={1} borderColor="gray.100" borderRadius="16px" marginBottom={4}>
          <VStack space={2} paddingX={4} paddingY={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="700" color="primary.500">
                {user.contestsHistory.length === 0 ? (
                  <>Nenhuma competição concluída</>
                ) : (
                  <>{user.contestsHistory.length} competições concluídas</>
                )}
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.500">
                {user.contestsScore} pontos
              </Text>
            </HStack>

            <Text fontWeight="400" color="gray.500">
              Aqui você poderá ver todas as competições que você já participou.
            </Text>

            <Text alignSelf="flex-end" fontSize="sm" fontWeight="400" color="primary.500">
              Exibir mais
            </Text>
          </VStack>
        </Box>
      </Box>
    </ScrollView>
  )
}
