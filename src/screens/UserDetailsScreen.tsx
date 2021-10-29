import React, { useEffect, useState } from 'react'
import { Box, Button, HStack, ScrollView, Text, VStack } from 'native-base'

import { RootScreen } from '~/types/navigation'
import { OctopusIcon } from '~/components'
import { getUserById, getUserByUsername, isUserFollowing, toggleFollow, User } from '~/api'
import { LoadingScreen } from './LoadingScreen'

export const UserDetailsScreen: RootScreen<'UserDetails'> = ({ navigation, route }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(false)

  useEffect(() => {
    let unsubscribe = () => {}

    getUserByUsername(route.params.initialValues.username).then(({ user, userDoc }) => {
      setUser(user)
      isUserFollowing(user.id).then((value) => {
        if (!value) return
        setIsCurrentUserFollowing(value)
      })

      unsubscribe = userDoc.onSnapshot((user) => {
        getUserById(user.id).then(({ user }) => {
          setUser(user)
        })
        isUserFollowing(user.id).then((value) => {
          if (!value) return
          setIsCurrentUserFollowing(value)
        })
      })
    })

    return () => unsubscribe()
  }, [route.params.initialValues.username])

  if (!user) return <LoadingScreen />

  return (
    <ScrollView>
      <Box paddingX={6} paddingY={2}>
        <VStack marginBottom={4}>
          <HStack space={3}>
            <OctopusIcon backgroundColor="primary.500" flexGrow={0} flexShrink={0} flexBasis="80px" size="80px" />

            <Box flexShrink={1}>
              <Text fontWeight="600" fontSize="xl">
                {user.nickname}
              </Text>
              <Text fontWeight="600" color="primary.500">
                @{user.username}
              </Text>

              <HStack space={2} marginBottom={1}>
                <Text
                  fontWeight="600"
                  color="gray.500"
                  onPress={() => navigation.push('FollowersUsers', { followersUsers: user.followers })}
                >
                  {user.followers.length} seguidores
                </Text>
                <Text
                  fontWeight="600"
                  color="gray.500"
                  onPress={() => navigation.push('FollowingUsers', { followingUsers: user.following })}
                >
                  {user.following.length} seguindo
                </Text>
              </HStack>

              {!!user.bio && <Text fontWeight="600">{user.bio}</Text>}
            </Box>
          </HStack>
        </VStack>

        <Button
          padding={2}
          marginBottom={4}
          onPress={() => {
            setIsCurrentUserFollowing(!isCurrentUserFollowing)
            toggleFollow(user.id)
          }}
        >
          {isCurrentUserFollowing ? 'Deixar de seguir' : 'Seguir'}
        </Button>

        <Box backgroundColor="card" borderRadius="16px" marginBottom={4} paddingX={4}>
          <VStack space={2} paddingY={3}>
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
      </Box>
    </ScrollView>
  )
}
