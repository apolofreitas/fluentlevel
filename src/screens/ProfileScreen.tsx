import React from 'react'
import { Box, Button, HStack, ScrollView, Text, VStack } from 'native-base'
import { useCurrentUser } from '~/hooks'

import { OctopusIcon } from '~/components'
import { LoadingScreen } from '~/screens/LoadingScreen'
import { HomeScreen } from '~/types/navigation'

export const ProfileScreen: HomeScreen<'Profile'> = ({ navigation }) => {
  const { currentUser, isLoading } = useCurrentUser()

  if (isLoading) return <LoadingScreen />

  return (
    <ScrollView>
      <Box paddingX={6} paddingY={2}>
        <VStack marginBottom={4}>
          <HStack space={3}>
            <OctopusIcon backgroundColor="primary.500" flexGrow={0} flexShrink={0} flexBasis="80px" size="80px" />

            <Box flexShrink={1}>
              <Text fontWeight="600" fontSize="xl">
                {currentUser.nickname}
              </Text>
              <Text fontWeight="600" color="primary.500">
                @{currentUser.username}
              </Text>

              <HStack space={2} marginBottom={1}>
                <Text
                  fontWeight="600"
                  color="gray.500"
                  onPress={() => navigation.push('FollowersUsers', { followersUsers: currentUser.followers })}
                >
                  {currentUser.followers.length} seguidores
                </Text>
                <Text
                  fontWeight="600"
                  color="gray.500"
                  onPress={() => navigation.push('FollowingUsers', { followingUsers: currentUser.following })}
                >
                  {currentUser.following.length} seguindo
                </Text>
              </HStack>

              {!!currentUser.bio && <Text fontWeight="600">{currentUser.bio}</Text>}
            </Box>
          </HStack>
        </VStack>

        <Button padding={2} marginBottom={4} onPress={() => navigation.navigate('EditProfile')}>
          Editar Perfil
        </Button>

        <Box backgroundColor="card" borderRadius="16px" marginBottom={4} paddingX={4}>
          <VStack space={2} paddingY={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="xl" fontWeight="700" color="primary.500">
                Pontuação total
              </Text>
              <Text color="primary.500">{currentUser.tasksScore + currentUser.contestsScore} pontos</Text>
            </HStack>

            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="600">Tarefas</Text>
              <Text color="gray.500">{currentUser.tasksScore} pontos</Text>
            </HStack>

            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="600">Competições</Text>
              <Text color="gray.500">{currentUser.contestsScore} pontos</Text>
            </HStack>
          </VStack>
        </Box>

        <Text fontSize="xl" fontWeight="700" color="primary.500" marginLeft={1} marginBottom={2}>
          Histórico
        </Text>

        <Box backgroundColor="card" borderRadius="16px" marginBottom={2} paddingX={4}>
          <VStack space={2} paddingY={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="700" color="primary.500">
                {currentUser.tasksHistory.length === 0 ? (
                  <>Nenhuma tarefa concluída</>
                ) : (
                  <>{currentUser.tasksHistory.length} tarefas concluídas</>
                )}
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.500">
                {currentUser.tasksScore} pontos
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

        <Box backgroundColor="card" borderRadius="16px" marginBottom={4} paddingX={4}>
          <VStack space={2} paddingY={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="700" color="primary.500">
                {currentUser.contestsHistory.length === 0 ? (
                  <>Nenhuma competição concluída</>
                ) : (
                  <>{currentUser.contestsHistory.length} competições concluídas</>
                )}
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.500">
                {currentUser.contestsScore} pontos
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
