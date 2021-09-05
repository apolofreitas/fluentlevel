import { RootParamList as MyRootParamList } from '~/types/navigation'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MyRootParamList {}
  }

  declare module '*.svg' {
    import React from 'react'
    import { SvgProps } from 'react-native-svg'
    const content: React.FC<SvgProps>
    export default content
  }
}
