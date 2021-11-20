import { Dimensions } from 'react-native'
import { move } from 'react-native-redash'

import { SharedValues } from '~/types/animated'

export type LayoutValues = ReturnType<typeof getLayoutValues>

export const layoutConstants = {
  wordHeight: 56,
  separatorHeight: 16,
  marginX: 32,
}

export const getLayoutValues = (offsets: Offset[]) => {
  const containerWidth = Dimensions.get('window').width - layoutConstants.marginX * 2
  const fullWordsWidth = offsets.reduce((acc, o) => acc + o.width.value, 0)
  const numberOfLines = 2 + Math.floor(fullWordsWidth / containerWidth)
  const sentenceHeight = numberOfLines * layoutConstants.wordHeight
  const containerHeight =
    sentenceHeight + layoutConstants.separatorHeight + (numberOfLines - 1) * layoutConstants.wordHeight

  return {
    ...layoutConstants,
    containerWidth,
    numberOfLines,
    sentenceHeight,
    containerHeight,
  }
}

export type Offset = SharedValues<{
  wordId: number
  order: number
  width: number
  x: number
  y: number
  originalX: number
  originalY: number
}>

const isNotInBank = (offset: Offset) => {
  'worklet'
  return offset.order.value !== -1
}

const byOrder = (a: Offset, b: Offset) => {
  'worklet'
  return a.order.value > b.order.value ? 1 : -1
}

export const lastOrder = (input: Offset[]) => {
  'worklet'
  return input.filter(isNotInBank).length
}

export const remove = (input: Offset[], index: number) => {
  'worklet'
  const offsets = input
    .filter((_, i) => i !== index)
    .filter(isNotInBank)
    .sort(byOrder)
  offsets.map((offset, i) => (offset.order.value = i))
}

export const reorder = (input: Offset[], from: number, to: number) => {
  'worklet'
  const offsets = input.filter(isNotInBank).sort(byOrder)
  const newOffset = move(offsets, from, to)
  newOffset.map((offset, index) => (offset.order.value = index))
}

export const getFilteredOffsets = (input: Offset[]) => {
  'worklet'
  return input.filter(isNotInBank).sort(byOrder)
}

export const calculateLayout = (input: Offset[], { containerWidth, wordHeight }: LayoutValues) => {
  'worklet'
  const offsets = input.filter(isNotInBank).sort(byOrder)

  if (offsets.length === 0) return

  let line = 0

  offsets.forEach((offset, index) => {
    if (index === 0) {
      offset.x.value = 0
      offset.y.value = 0
      return
    }

    const offsetX = offsets.slice(index - 1, index).reduce((acc, o) => acc + o.x.value + o.width.value, 0)
    const nextOffsetX = offsetX + offset.width.value

    if (nextOffsetX < containerWidth) {
      offset.x.value = offsetX
    } else {
      offset.x.value = 0
      line++
    }

    offset.y.value = line * wordHeight
  })
}
