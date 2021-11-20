import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import { between, useVector } from 'react-native-redash'

import {
  calculateLayout,
  lastOrder,
  Offset,
  remove,
  reorder,
  getLayoutValues,
  LayoutValues,
} from '~/utils/questionLayout'
import { OrganizeQuestionWord } from './OrganizeQuestionWord'
import { OrganizeQuestionSortableWordWrapper } from './OrganizeQuestionSortableWordWrapper'

interface OrganizeQuestionSortableWordsProps {
  offsets: Offset[]
  layoutValues: LayoutValues
  words: { id: number; text: string }[]
}

export const OrganizeQuestionSortableWords = ({ offsets, layoutValues, words }: OrganizeQuestionSortableWordsProps) => {
  return (
    <>
      {words.map((word, index) => (
        <OrganizeQuestionSortableWordWrapper key={word.id} index={index} offsets={offsets} layoutValues={layoutValues}>
          <OrganizeQuestionWord id={word.id} word={word.text} />
        </OrganizeQuestionSortableWordWrapper>
      ))}
    </>
  )
}
