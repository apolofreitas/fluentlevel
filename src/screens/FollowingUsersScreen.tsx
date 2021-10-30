import React from 'react'
import { Box, ScrollView, Text } from 'native-base'

import { RootScreen } from '~/types/navigation'
import { UserList } from '~/components'

export const FollowingUsersScreen: RootScreen<'FollowingUsers'> = ({ navigation, route }) => {
  const { followingUsers } = route.params

  return (
    <ScrollView>
      <Box padding={4}>
        {followingUsers.length > 0 ? (
          <UserList users={followingUsers} />
        ) : (
          <Text textAlign="center" fontWeight="600">
            Parece que você ainda não segue ninguém.
          </Text>
        )}
      </Box>
    </ScrollView>
  )
}
