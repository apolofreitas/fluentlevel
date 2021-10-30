import React from 'react'
import { StyleSheet } from 'react-native'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { TasksParamList } from '~/types/navigation'

import { CommunityTasksScreen } from '~/screens/CommunityTasksScreen'
import { CreatedTasksScreen } from '~/screens/CreatedTasksScreen'

const Tab = createMaterialTopTabNavigator<TasksParamList>()

export function TasksNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tab.Screen
        name="CommunityTasks"
        component={CommunityTasksScreen}
        options={{
          tabBarLabel: 'Comunidade',
        }}
      />
      <Tab.Screen
        name="CreatedTasks"
        component={CreatedTasksScreen}
        options={{
          tabBarLabel: 'Criações',
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontFamily: 'NunitoSemibold',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
})
