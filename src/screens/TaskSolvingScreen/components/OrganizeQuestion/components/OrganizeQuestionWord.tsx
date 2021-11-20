import React from 'react'
import { Box, Text } from 'native-base'
import { layoutConstants } from '~/utils/questionLayout'

interface OrganizeQuestionWordProps {
  id: number
  word: string
}

export const OrganizeQuestionWord = ({ word }: OrganizeQuestionWordProps) => {
  return (
    <>
      <Box height={`${layoutConstants.wordHeight}px`} padding={1}>
        <Box
          backgroundColor="card"
          height="100%"
          paddingX={3}
          borderRadius="8px"
          alignItems="center"
          justifyContent="center"
        >
          <Text textAlign="center">{word}</Text>
          <Box
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            right="0"
            borderRadius="8px"
            borderColor="gray.100"
            borderLeftWidth="2px"
            borderTopWidth="2px"
            borderRightWidth="3px"
            borderBottomWidth="6px"
          />
        </Box>
      </Box>
    </>
  )
}
