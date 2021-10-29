import React from 'react'
import { ScrollView } from 'native-base'

import { RootScreen } from '~/types/navigation'
import { UserList } from '~/components/UserList'

export const FollowingUsersScreen: RootScreen<'FollowingUsers'> = ({ navigation, route }) => {
  const { followingUsers } = route.params

  return (
    <ScrollView>
      <UserList users={followingUsers} />
    </ScrollView>
  )
}
