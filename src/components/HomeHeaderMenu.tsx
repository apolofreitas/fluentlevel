import * as React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { AlertDialog, Button, Factory, Icon, IconButton, Menu, Text } from 'native-base'

import { signOut } from '~/api'

interface ConfirmSignOutDialogProps {
  isOpen: boolean
  onClose: () => void
}
function ConfirmSignOutDialog({ isOpen, onClose }: ConfirmSignOutDialogProps) {
  const cancelRef = React.useRef()

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.Body padding={0}>
          <Text fontSize="lg" fontWeight="600">
            Tem certeza que deseja sair da sua conta?
          </Text>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button variant="ghost" ref={cancelRef} onPress={onClose}>
            Cancelar
          </Button>
          <Button
            marginLeft={3}
            onPress={() => {
              signOut()
              onClose()
            }}
          >
            Sair
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}

export const HomeHeaderMenu = Factory(() => {
  const [isConfirmSignOutDialogOpen, setIsConfirmSignOutDialogOpen] = React.useState(false)

  return (
    <>
      <ConfirmSignOutDialog isOpen={isConfirmSignOutDialogOpen} onClose={() => setIsConfirmSignOutDialogOpen(false)} />

      <Menu
        trigger={(triggerProps) => (
          <IconButton
            {...triggerProps}
            variant="unstyled"
            icon={<Icon as={Feather} name="more-vertical" size="sm" />}
          />
        )}
        placement="top right"
      >
        <Menu.Item onPress={() => setIsConfirmSignOutDialogOpen(true)}>Sair</Menu.Item>
      </Menu>
    </>
  )
})
