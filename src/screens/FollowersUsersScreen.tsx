import React from 'react'
import { ScrollView, Text } from 'native-base'

import { RootScreen } from '~/types/navigation'
import { UserList } from '~/components/UserList'

export const FollowersUsersScreen: RootScreen<'FollowersUsers'> = ({ navigation, route }) => {
  const { followersUsers } = route.params

  return (
    <ScrollView>
      <UserList users={followersUsers} />
    </ScrollView>
  )
}
