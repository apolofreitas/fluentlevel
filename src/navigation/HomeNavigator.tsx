import * as React from 'react'
import styled from 'styled-components/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Feather from 'react-native-vector-icons/Feather'

import { TasksScreen } from '~/screens/home/Tasks'
import { ContestsScreen } from '~/screens/home/Contests'
import { ProfileScreen } from '~/screens/home/Profile'
import { HorizontalLogo } from '~/assets'
import { SettingsMenuButton } from '~/components'
import { StyleSheet } from 'react-native'

export const TabBarIcon = styled(Feather).attrs({ size: 24 })``

const BottomTab = createBottomTabNavigator()

export function HomeNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTitle: () => <HorizontalLogo />,
        headerRight: () => <SettingsMenuButton />,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarIconStyle: styles.tabBarIconStyle,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <BottomTab.Screen
        name="Tarefas"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="book-open" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Competições"
        component={ContestsScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="award" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Meu perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="smile" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    marginBottom: 8,
  },
  tabBarIconStyle: {
    marginTop: 8,
  },
  tabBarStyle: {
    height: 64,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
  },
})
