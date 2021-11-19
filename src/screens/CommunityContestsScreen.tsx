import React, { useEffect, useState } from 'react'
import { Box, VStack, ScrollView, HStack, Text, Spacer, Input, Icon, Pressable } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { ContestsScreen } from '~/types/navigation'
import { Contest } from '~/api'
import { useContests } from '~/hooks'
import { LoadingScreen } from '~/screens/LoadingScreen'
import { calculateStringSimilarity } from '~/utils/calculateStringSimilarity'
import dateFormat from 'dateformat'

export const CommunityContestsScreen: ContestsScreen<'CommunityContests'> = ({ navigation }) => {
  const [search, setSearch] = useState('')
  const { communityContests, isLoading } = useContests()
  const [filteredCommunityContests, setFilteredCommunityContests] = useState<Contest[] | null>(
    communityContests.length > 0 ? communityContests : null,
  )

  useEffect(() => {
    setFilteredCommunityContests(
      communityContests
        .filter((communityContest) => {
          if (!search) return true

          if (search[0] === '@') {
            return `@${communityContest.author.username.toLocaleLowerCase()}`.includes(search.toLocaleLowerCase())
          }

          return (
            communityContest.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            (communityContest.description || '').toLocaleLowerCase().includes(search.toLocaleLowerCase())
          )
        })
        .sort((a, b) => {
          if (!search) return 0

          const similarityA = Math.max(
            calculateStringSimilarity(a.title, search),
            calculateStringSimilarity(a.description || '', search),
            calculateStringSimilarity(`@${a.author.username}`, search),
          )
          const similarityB = Math.max(
            calculateStringSimilarity(b.title, search),
            calculateStringSimilarity(b.description || '', search),
            calculateStringSimilarity(`@${b.author.username}`, search),
          )

          return similarityB - similarityA
        }),
    )
  }, [search, communityContests])

  if (isLoading || filteredCommunityContests === null) return <LoadingScreen />

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

        <VStack space={3}>
          {filteredCommunityContests.length === 0 ? (
            <Text>Foi mal, não conseguimos encontrar nenhum resultado.</Text>
          ) : (
            filteredCommunityContests.map((contest) => {
              return (
                <Pressable key={contest.id} onPress={() => navigation.navigate('ContestDetails', { contest })}>
                  <Box backgroundColor="card" borderRadius="16px" paddingX={4} paddingY={3}>
                    <Text
                      flexShrink={1}
                      isTruncated
                      textAlign="justify"
                      fontSize="lg"
                      fontWeight="700"
                      color="primary.500"
                    >
                      {contest.title}
                    </Text>
                    <Text color="primary.700">@{contest.author.username}</Text>
                    <Text color="gray.500" fontSize="sm">
                      {`Duração: ${dateFormat(contest.startDate.toDate(), 'dd/mm/yy HH:MM')} - ${dateFormat(
                        contest.endDate.toDate(),
                        'dd/mm/yy HH:MM',
                      )}`}
                    </Text>
                    {!!contest.description && <Text>{contest.description}</Text>}
                  </Box>
                </Pressable>
              )
            })
          )}
        </VStack>
      </Box>
    </ScrollView>
  )
}
