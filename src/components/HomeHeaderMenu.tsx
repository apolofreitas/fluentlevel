import * as React from 'react'
import { Alert } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { Factory, Icon, IconButton, Menu } from 'native-base'

import { signOut } from '~/api'

export const HomeHeaderMenu = Factory(() => {
  const confirmSignOut = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: signOut,
        },
      ],
      {
        cancelable: true,
      },
    )
  }

  return (
    <Menu
      trigger={(triggerProps) => (
        <IconButton {...triggerProps} variant="unstyled" icon={<Icon as={Feather} name="more-vertical" size="sm" />} />
      )}
      placement="top right"
    >
      <Menu.Item onPress={confirmSignOut}>Sair</Menu.Item>
    </Menu>
  )
})
