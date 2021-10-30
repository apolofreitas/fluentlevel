import React from 'react'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Feather from 'react-native-vector-icons/Feather'

import { HomeParamList } from '~/types/navigation'
import { Header, ProfileHeaderMenu } from '~/components'

import { ContestsNavigator } from './ContestsNavigator'
import { TasksNavigator } from './TasksNavigator'
import { ProfileScreen } from '~/screens/ProfileScreen'

const BottomTab = createBottomTabNavigator<HomeParamList>()

export function HomeNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarIconStyle: styles.tabBarIconStyle,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <BottomTab.Screen
        name="Tasks"
        component={TasksNavigator}
        options={{
          tabBarLabel: 'Tarefas',
          header: () => <Header showLogoInTitle />,
          tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Contests"
        component={ContestsNavigator}
        options={{
          tabBarLabel: 'Competições',
          header: () => <Header showLogoInTitle />,
          tabBarIcon: ({ color }) => <Feather name="award" size={24} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Meu perfil',
          header: () => <Header showLogoInTitle headerRight={() => <ProfileHeaderMenu />} />,
          tabBarIcon: ({ color }) => <Feather name="smile" size={24} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontFamily: 'NunitoBold',
    fontSize: 12,
    marginBottom: 8,
  },
  tabBarIconStyle: {
    marginTop: 8,
  },
  tabBarStyle: {
    height: 64,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
