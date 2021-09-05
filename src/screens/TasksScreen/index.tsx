import * as React from 'react'
import { useWindowDimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { Text } from 'native-base'

import { CommunityTasksTab } from './CommunityTasksTab'
import { CreatedTasksTab } from './CreatedTasksTab'
import { colors } from '~/theme/colors'

import { HomeScreen } from '~/types/navigation'

const renderScene = SceneMap({ CommunityTasksTab, CreatedTasksTab })

export const TasksScreen: HomeScreen<'Tasks'> = () => {
  const layout = useWindowDimensions()

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'CommunityTasksTab', title: 'Comunidade' },
    { key: 'CreatedTasksTab', title: 'Criações' },
  ])

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: colors.primary[700] }}
          style={{ backgroundColor: colors.background, elevation: 0 }}
          renderLabel={({ route, focused }) => (
            <Text fontWeight="600" color={focused ? 'primary.700' : 'gray.300'}>
              {route.title}
            </Text>
          )}
        />
      )}
      initialLayout={{ width: layout.width }}
    />
  )
}
