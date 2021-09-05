import * as React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { HStack, Icon, IconButton, Spacer, Text } from 'native-base'
import { useNavigation, useRoute } from '@react-navigation/core'

import { SmallLogo } from '~/assets'

interface HeaderProps {
  title?: string
  showLogoInTitle?: boolean
  centerTitle?: boolean
  canGoBack?: boolean
  headerLeft?:
    | ((props: {
        tintColor?: string | undefined
        pressColor?: string | undefined
        pressOpacity?: number | undefined
      }) => React.ReactNode)
    | undefined
  headerRight?:
    | ((props: {
        tintColor?: string | undefined
        pressColor?: string | undefined
        pressOpacity?: number | undefined
      }) => React.ReactNode)
    | undefined
}

export const Header: React.FC<HeaderProps> = ({
  title = 'fluentlevel',
  showLogoInTitle = false,
  centerTitle = false,
  canGoBack = false,
  headerLeft,
  headerRight,
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

      {!!headerLeft && headerLeft({})}

      <HStack paddingX={2} space={2} position={centerTitle ? 'absolute' : undefined}>
        {showLogoInTitle && <SmallLogo />}
        <Text color="primary.700" fontSize={20} fontWeight="bold">
          {title}
        </Text>
      </HStack>

      <Spacer />

      {!!headerRight && headerRight({})}
    </HStack>
  )
}
