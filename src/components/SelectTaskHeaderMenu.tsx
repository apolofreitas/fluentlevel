import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { Factory, Icon, IconButton, Menu } from 'native-base'
import { useNavigation } from '@react-navigation/native'

export const SelectTaskHeaderMenu = Factory(() => {
  const navigation = useNavigation()

  return (
    <Menu
      trigger={(triggerProps) => (
        <IconButton {...triggerProps} variant="unstyled" icon={<Icon as={Feather} name="more-vertical" size="sm" />} />
      )}
      placement="top right"
    >
      <Menu.Item onPress={() => navigation.navigate('SaveTask')}>Nova Tarefa</Menu.Item>
    </Menu>
  )
})
