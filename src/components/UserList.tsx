import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { Box, HStack, Pressable, Spacer, Text, VStack } from 'native-base'
import React from 'react'

import { UserModel } from '~/api'
import { useCurrentUser } from '~/hooks'
import { RootParamList } from '~/types/navigation'
import { FollowButton } from './FollowButton'
import { OctopusIcon } from './OctopusIcon'

interface UserListProps {
  users: UserModel[]
}

export const UserList: React.FC<UserListProps> = ({ users }) => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>()
  const { currentUser } = useCurrentUser()

  return (
    <VStack space={2}>
      {users
        .sort(({ username }) => (username === currentUser.username ? -1 : 0))
        .map((user) => {
          return (
            <Pressable
              key={user.username}
              onPress={() =>
                user.username === currentUser.username
                  ? navigation.navigate('Home', { screen: 'Profile' })
                  : navigation.push('UserDetails', {
                      initialValues: {
                        username: user.username,
                      },
                    })
              }
            >
              <HStack space={3} alignItems="center">
                <OctopusIcon backgroundColor="primary.500" flexGrow={0} flexShrink={0} flexBasis="60px" size="60px" />

                <Box flexShrink={1}>
                  <Text fontWeight="600" fontSize="xl">
                    {user.nickname}
                  </Text>
                  <Text fontWeight="600" color="primary.500">
                    @{user.username}
                  </Text>
                </Box>

                <Spacer />

                {user.username !== currentUser.username && <FollowButton user={user} />}
              </HStack>
            </Pressable>
          )
        })}
    </VStack>
  )
}
