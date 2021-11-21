import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useSharedValue,
  useDerivedValue,
  runOnUI,
} from 'react-native-reanimated'
import {
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import { between, useVector } from 'react-native-redash'

import { calculateLayout, lastOrder, Offset, remove, reorder, LayoutValues } from '~/utils/questionLayout'

interface OrganizeQuestionSortableWordWrapperProps {
  offsets: Offset[]
  layoutValues: LayoutValues
  index: number
}

export const OrganizeQuestionSortableWordWrapper: React.FC<OrganizeQuestionSortableWordWrapperProps> = ({
  offsets,
  layoutValues,
  index,
  children,
}) => {
  const offset = offsets[index]!
  const isGestureActive = useSharedValue(false)
  const isAnimating = useSharedValue(false)
  const translation = useVector()
  const isInBank = useDerivedValue(() => offset.order.value === -1)

  const onPress = ({}: PanGestureHandlerEventPayload) => {
    'worklet'

    if (isInBank.value) {
      offset.order.value = lastOrder(offsets)
    } else {
      offset.order.value = -1
      remove(offsets, index)
    }

    calculateLayout(offsets, layoutValues)

    isAnimating.value = true
    translation.x.value = withSpring(offset.x.value, {}, () => (isAnimating.value = false))
    translation.y.value = withSpring(offset.y.value, {})
  }

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { x: number; y: number }>({
    onStart: (_, ctx) => {
      if (isInBank.value) {
        translation.x.value = offset.originalX.value - layoutValues.marginX
        translation.y.value = offset.originalY.value + layoutValues.sentenceHeight
      } else {
        translation.x.value = offset.x.value
        translation.y.value = offset.y.value
      }
      ctx.x = translation.x.value
      ctx.y = translation.y.value
    },
    onActive: ({ translationX, translationY }, ctx) => {
      isGestureActive.value = true
      translation.x.value = ctx.x + translationX
      translation.y.value = ctx.y + translationY
      if (isInBank.value && translation.y.value < layoutValues.sentenceHeight) {
        offset.order.value = lastOrder(offsets)
        calculateLayout(offsets, layoutValues)
      } else if (!isInBank.value && translation.y.value > layoutValues.sentenceHeight) {
        offset.order.value = -1
        remove(offsets, index)
        calculateLayout(offsets, layoutValues)
      }
      for (let i = 0; i < offsets.length; i++) {
        const o = offsets[i]!
        if (i === index && o.order.value !== -1) {
          continue
        }
        if (
          between(translation.x.value, o.x.value, o.x.value + o.width.value) &&
          between(translation.y.value, o.y.value, o.y.value + layoutValues.wordHeight)
        ) {
          reorder(offsets, offset.order.value, o.order.value)
          calculateLayout(offsets, layoutValues)
          break
        }
      }
    },
    onEnd: ({ velocityX, velocityY }) => {
      isAnimating.value = true
      translation.x.value = withSpring(offset.x.value, { velocity: velocityX }, () => (isAnimating.value = false))
      translation.y.value = withSpring(offset.y.value, { velocity: velocityY })
      isGestureActive.value = false
    },
  })

  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value
    }
    return withSpring(isInBank.value ? offset.originalX.value - layoutValues.marginX : offset.x.value)
  })

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value
    }
    return withSpring(isInBank.value ? offset.originalY.value + layoutValues.sentenceHeight : offset.y.value)
  })

  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: isGestureActive.value || isAnimating.value ? 100 : 0,
      width: offset.width.value,
      height: layoutValues.wordHeight,
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }
  })

  return (
    <Animated.View style={style}>
      <PanGestureHandler
        minDist={1}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.oldState !== 4 && nativeEvent.state === 5) runOnUI(onPress)(nativeEvent)
        }}
      >
        <Animated.View style={StyleSheet.absoluteFill}>{children}</Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}
