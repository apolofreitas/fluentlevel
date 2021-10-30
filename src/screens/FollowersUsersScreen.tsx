import React from 'react'
import { Box, ScrollView, Text } from 'native-base'

import { RootScreen } from '~/types/navigation'
import { UserList } from '~/components'

export const FollowersUsersScreen: RootScreen<'FollowersUsers'> = ({ route }) => {
  const { followersUsers } = route.params

  return (
    <ScrollView>
      <Box padding={4}>
        {followersUsers.length > 0 ? (
          <UserList users={followersUsers} />
        ) : (
          <Text textAlign="center" fontWeight="600">
            Parece que você ainda não segue ninguém.
          </Text>
        )}
      </Box>
    </ScrollView>
  )
}
