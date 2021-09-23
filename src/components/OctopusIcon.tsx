import * as React from 'react'
import { Factory, Center, ICenterProps } from 'native-base'
import { SmallLogo } from '~/assets'
import { colors } from '~/theme/colors'

interface OctopusIconProps {
  logoColor?: string
}

export const OctopusIcon = Factory<OctopusIconProps & ICenterProps>(({ logoColor, ...rest }) => {
  return (
    <Center backgroundColor="gray.300" borderRadius="16px" flex={1} padding={3} {...rest}>
      <SmallLogo fill={logoColor || colors.card} />
    </Center>
  )
})
