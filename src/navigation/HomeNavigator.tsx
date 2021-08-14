import * as React from 'react'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Feather from 'react-native-vector-icons/Feather'

import { TasksScreen } from '~/screens/home/TasksScreen'
import { ContestsScreen } from '~/screens/home/ContestsScreen'
import { ProfileScreen } from '~/screens/home/ProfileScreen'
import { Header, HomeHeaderMenu } from '~/components'

const BottomTab = createBottomTabNavigator()

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
        name="Tarefas"
        component={TasksScreen}
        options={{
          header: () => <Header showLogoInTitle rightHeader={() => <HomeHeaderMenu />} />,
          tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Competições"
        component={ContestsScreen}
        options={{
          header: () => <Header showLogoInTitle rightHeader={() => <HomeHeaderMenu />} />,
          tabBarIcon: ({ color }) => <Feather name="award" size={24} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Meu perfil"
        component={ProfileScreen}
        options={{
          header: () => <Header showLogoInTitle rightHeader={() => <HomeHeaderMenu />} />,
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
