import { Box, Divider } from 'native-base'
import React from 'react'

import { LayoutValues } from '~/utils/questionLayout'

interface OrganizeQuestionLinesProps {
  layoutValues: LayoutValues
}

export const OrganizeQuestionLines: React.FC<OrganizeQuestionLinesProps> = ({ layoutValues }) => {
  return (
    <Box position="relative">
      {new Array(layoutValues.numberOfLines + 1).fill(0).map((_, index) => (
        <Divider
          key={index * layoutValues.wordHeight}
          top={`${index * layoutValues.wordHeight - 4}px`}
          height="2px"
          backgroundColor="gray.100"
        />
      ))}
    </Box>
  )
}
