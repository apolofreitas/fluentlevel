import React, { useEffect, useRef, useState } from 'react'
import { Box, Icon, Input, ScrollView } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { RootScreen } from '~/types/navigation'
import { UserList } from '~/components'
import { useUsers } from '~/hooks/useUsers'
import { LoadingScreen } from './LoadingScreen'
import { calculateStringSimilarity } from '~/utils/calculateStringSimilarity'

export const AddFriendScreen: RootScreen<'AddFriend'> = ({}) => {
  const [search, setSearch] = useState('')
  const isLoading = useUsers((state) => state.isLoading)
  const usersRef = useRef(useUsers.getState().users)
  const [users, setUsers] = useState(usersRef.current)

  if (isLoading) return <LoadingScreen />

  useEffect(() => {
    setUsers(
      usersRef.current
        .filter((communityTask) => {
          if (!search) return true

          return (
            communityTask.nickname.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            communityTask.username.toLocaleLowerCase().includes(search.toLocaleLowerCase())
          )
        })
        .sort((a, b) => {
          if (!search) return 0

          const similarityA = Math.max(
            calculateStringSimilarity(search, a.nickname),
            calculateStringSimilarity(search, a.nickname),
          )
          const similarityB = Math.max(
            calculateStringSimilarity(search, b.nickname),
            calculateStringSimilarity(search, b.nickname),
          )
          return similarityB - similarityA
        }),
    )
  }, [search])

  return (
    <ScrollView>
      <Box paddingX={6} paddingY={4}>
        <Input
          flex={1}
          size="sm"
          height={10}
          placeholder="Pesquisar"
          value={search}
          onChangeText={setSearch}
          paddingLeft={0}
          InputLeftElement={<Icon as={Feather} name="search" size="sm" color="primary.500" margin={3} />}
          marginBottom={4}
        />

        <UserList users={users} />
      </Box>
    </ScrollView>
  )
}
