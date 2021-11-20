import React from 'react'
import { Box } from 'native-base'
import { LayoutValues, Offset } from '~/utils/questionLayout'

interface OrganizeQuestionPlaceholdersProps {
  offsets: Offset[]
  layoutValues: LayoutValues
}

export const OrganizeQuestionPlaceholders = ({ offsets, layoutValues }: OrganizeQuestionPlaceholdersProps) => {
  return (
    <>
      {offsets.map((offset) => (
        <Box
          key={offset.wordId.value}
          position="absolute"
          zIndex={-1}
          backgroundColor="gray.100"
          borderRadius={8}
          top={offset.originalY.value + layoutValues.sentenceHeight + 4}
          left={offset.originalX.value - layoutValues.marginX + 4}
          width={`${offset.width.value - 8}px`}
          height={`${layoutValues.wordHeight - 8}px`}
        />
      ))}
    </>
  )
}
