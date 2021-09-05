import * as React from 'react'
import { Factory, Center, Box, Button, IButtonProps } from 'native-base'
import { SmallLogo } from '~/assets'
import { colors } from '~/theme/colors'

interface OctopusIconProps {
  logoColor?: string
}

export const OctopusIcon = Factory<OctopusIconProps & IButtonProps>(({ logoColor, ...rest }) => {
  return (
    <Button variant="unstyled" backgroundColor="gray.300" borderRadius="16px" {...rest}>
      <Center flex={1} padding={3}>
        <SmallLogo fill={logoColor || colors.card} />
      </Center>
    </Button>
  )
})
