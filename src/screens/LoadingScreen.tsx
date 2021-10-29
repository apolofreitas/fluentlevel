import React from 'react'
import { Center, Factory, Spinner } from 'native-base'

export const LoadingScreen = Factory(({ ...rest }) => {
  return (
    <Center flex={1} {...rest}>
      <Spinner />
    </Center>
  )
})
