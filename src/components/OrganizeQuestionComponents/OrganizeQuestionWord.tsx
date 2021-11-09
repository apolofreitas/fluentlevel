import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { WORD_HEIGHT } from '~/utils/questionLayout'

const styles = StyleSheet.create({
  root: {
    padding: 4,
  },
  container: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E6E8',
    backgroundColor: 'white',
    height: WORD_HEIGHT - 8,
  },
  text: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderColor: '#E8E6E8',
    top: 4,
  },
})

interface OrganizeQuestionWordProps {
  id: number
  word: string
}

export const OrganizeQuestionWord = ({ word }: OrganizeQuestionWordProps) => {
  return (
    <View style={styles.root}>
      <View>
        <View style={styles.container}>
          <Text style={styles.text}>{word}</Text>
        </View>
        <View style={styles.shadow} />
      </View>
    </View>
  )
}
