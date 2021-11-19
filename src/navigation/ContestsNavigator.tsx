import React from 'react'
import { StyleSheet } from 'react-native'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { ContestsParamList } from '~/types/navigation'

import { CommunityContestsScreen } from '~/screens/CommunityContestsScreen'
import { CreatedContestsScreen } from '~/screens/CreatedContestsScreen'
import { ParticipatingContestsScreen } from '~/screens/ParticipatingContests'

const Tab = createMaterialTopTabNavigator<ContestsParamList>()

export function ContestsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tab.Screen
        name="CommunityContests"
        component={CommunityContestsScreen}
        options={{
          tabBarLabel: 'Comunidade',
        }}
      />
      <Tab.Screen
        name="ParticipatingContests"
        component={ParticipatingContestsScreen}
        options={{
          tabBarLabel: 'Participando',
        }}
      />
      <Tab.Screen
        name="CreatedContests"
        component={CreatedContestsScreen}
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
