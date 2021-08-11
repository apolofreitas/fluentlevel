import * as React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { Factory, Icon, IconButton, Menu } from 'native-base'

export const SettingsMenuButton = Factory(() => {
  return (
    <Menu
      trigger={(triggerProps) => (
        <IconButton
          {...triggerProps}
          variant="unstyled"
          icon={
            <Icon
              as={<Feather name="more-vertical" />}
              size="sm"
              color="primary.700"
            />
          }
        />
      )}
    >
      <Menu.Item>Menu item 1</Menu.Item>
      <Menu.Item>Menu item 2</Menu.Item>
    </Menu>
  )
})
