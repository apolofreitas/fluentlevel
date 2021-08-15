import * as React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { HStack, Icon, IconButton, Spacer, Text } from 'native-base'
import { useNavigation } from '@react-navigation/core'

import { SmallLogo } from '~/assets'

interface HeaderProps {
  title?: string
  showLogoInTitle?: boolean
  centerTitle?: boolean
  canGoBack?: boolean
  leftHeader?: React.FC
  rightHeader?: React.FC
}

export const Header: React.FC<HeaderProps> = ({
  title = 'fluentlevel',
  showLogoInTitle = false,
  centerTitle = false,
  canGoBack = false,
  leftHeader: LeftHeaderComponent = React.Fragment,
  rightHeader: RightHeaderComponent = React.Fragment,
}) => {
  const navigation = useNavigation()

  return (
    <HStack height={16} paddingX={4} space={2} justifyContent="center" alignItems="center" backgroundColor="background">
      {canGoBack && (
        <IconButton
          variant="unstyled"
          icon={<Icon as={Feather} name="chevron-left" size="sm" />}
          onPress={() => navigation.goBack()}
        />
      )}

      <LeftHeaderComponent />

      <HStack paddingX={2} space={2} position={centerTitle ? 'absolute' : undefined}>
        {showLogoInTitle && <SmallLogo />}
        <Text color="primary.700" fontSize={20} fontWeight="bold">
          {title}
        </Text>
      </HStack>

      <Spacer />

      <RightHeaderComponent />
    </HStack>
  )
}
