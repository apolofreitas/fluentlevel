import React, { useCallback, useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { Box, HStack, ScrollView, Text, VStack } from 'native-base'
import { useFocusEffect } from '@react-navigation/core'
import { LineChart } from 'react-native-chart-kit'
import dateFormat from 'dateformat'

import { RootScreen } from '~/types/navigation'
import { FollowButton, OctopusIcon } from '~/components'
import { getUserById, getUserByUsername, User } from '~/api'
import { LoadingScreen } from './LoadingScreen'
import { colors } from '~/theme/colors'
import { useCurrentUser } from '~/hooks'

export const UserDetailsScreen: RootScreen<'UserDetails'> = ({ navigation, route }) => {
  const { currentUser } = useCurrentUser()
  const [user, setUser] = useState<User | null>(null)

  const labels = useMemo(() => {
    const month = new Date().getMonth()
    const getMonth = (month: number) => dateFormat(new Date(0, month), 'mmm')
    return Array.from([month - 5, month - 4, month - 3, month - 2, month - 1, month]).map(getMonth)
  }, [])

  const currentUserChartData = useMemo(getChartDataFrom(currentUser), [])
  const userChartData = useMemo(() => {
    if (!user) return []
    return getChartDataFrom(user)()
  }, [user])

  function getChartDataFrom(user: User) {
    return () => {
      const month = new Date().getMonth()
      const getMonthDate = (month: number) => {
        const now = new Date()
        return new Date(now.getFullYear(), month)
      }
      return Array.from([month - 5, month - 4, month - 3, month - 2, month - 1, month])
        .map(getMonthDate)
        .map((date) => {
          return (
            user.contestsHistory.reduce((acc, history) => {
              const submittedAtDate = history.submittedAt.toDate()
              if (
                submittedAtDate.getFullYear() === date.getFullYear() &&
                submittedAtDate.getMonth() === date.getMonth()
              ) {
                return acc + history.totalScore
              }
              return acc
            }, 0) +
            user.tasksHistory.reduce((acc, history) => {
              const submittedAtDate = history.submittedAt.toDate()
              if (
                submittedAtDate.getFullYear() === date.getFullYear() &&
                submittedAtDate.getMonth() === date.getMonth()
              ) {
                return acc + history.totalScore
              }
              return acc
            }, 0)
          )
        })
    }
  }

  useFocusEffect(
    useCallback(() => {
      let unsubscribe = () => {}

      getUserByUsername(route.params.initialValues.username).then(({ user, userDoc }) => {
        if (!navigation.isFocused()) return
        setUser(user)

        unsubscribe = userDoc.onSnapshot((user) => {
          getUserById(user.id).then(({ user }) => {
            if (!navigation.isFocused()) return
            setUser(user)
          })
        })
      })

      return () => unsubscribe()
    }, [route.params.initialValues.username]),
  )

  if (!user) return <LoadingScreen />

  return (
    <ScrollView>
      <VStack space={4} paddingX={6} paddingTop={2} paddingBottom={4}>
        <VStack>
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

        <FollowButton user={user} padding={2} />

        <Box backgroundColor="card" borderRadius="16px" paddingX={4}>
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

        <Text fontSize="xl" fontWeight="700" color="primary.500">
          Eu vs. Você
        </Text>

        <Box backgroundColor="card" borderRadius="16px" paddingTop={4}>
          <LineChart
            width={Dimensions.get('window').width - 60}
            height={220}
            data={{
              labels,
              datasets: [
                {
                  data: userChartData,
                  color: (opacity = 1) => colors['primary']['200'],
                  strokeDashArray: [4],
                },
                {
                  data: currentUserChartData,
                  color: (opacity = 1) => colors['primary']['500'],
                },
              ],
              legend: [`@${user.username}`, `@${currentUser.username}`],
            }}
            yAxisLabel=""
            yAxisSuffix=""
            withInnerLines={false}
            withShadow={false}
            fromZero
            chartConfig={{
              decimalPlaces: 0,

              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,

              paddingRight: 16,
              paddingTop: 16,

              color: (opacity = 1) => colors['primary']['500'],
              labelColor: (opacity = 1) => colors['darkText'],
              propsForLabels: {
                fontFamily: 'NunitoSemiBold',
                fontSize: 14,
              },
            }}
          />
        </Box>
      </VStack>
    </ScrollView>
  )
}
