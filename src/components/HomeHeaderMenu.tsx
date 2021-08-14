import * as React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { Factory, Icon, IconButton, Menu } from 'native-base'

import { signOut } from '~/api'

export const HomeHeaderMenu = Factory(() => {
  return (
    <Menu
      trigger={(triggerProps) => (
        <IconButton {...triggerProps} variant="unstyled" icon={<Icon as={Feather} name="more-vertical" size="sm" />} />
      )}
      placement="top right"
    >
      <Menu.Item onPress={signOut}>Sair</Menu.Item>
    </Menu>
  )
})
