import React, { useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import Voice from '@react-native-voice/voice'
import { Button, IButtonProps, Icon, useToast } from 'native-base'
import { showSimpleToast } from '~/utils'

interface RecognizeAudioButtonProps extends IButtonProps {
  locale: 'pt-BR' | 'en-US'
  onRecognize?: (...values: string[]) => void
}

export const RecognizeAudioButton: React.FC<RecognizeAudioButtonProps> = ({ locale, onRecognize, ...rest }) => {
  const toast = useToast()
  const [isRecognizing, setIsRecognizing] = useState(false)

  useEffect(() => {
    Voice.onSpeechStart = () => setIsRecognizing(true)
    Voice.onSpeechEnd = () => setIsRecognizing(false)
    Voice.onSpeechError = ({ error }) => {
      setIsRecognizing(false)

      if (!error?.code) return

      if (error.code === '5') {
        return showSimpleToast(toast, 'Erro: Comportamento inesperado')
      } else if (error.code === '7') {
        return showSimpleToast(toast, 'Não foi possível reconhecer')
      }

      return showSimpleToast(toast, `Error ${error.message}`.split('/').join(': '))
    }
    Voice.onSpeechResults = (e) => {
      if (!e.value) return
      onRecognize && onRecognize(...e.value)
    }

    return () => {
      Voice.removeAllListeners()
      Voice.cancel().then(() => Voice.destroy())
    }
  }, [onRecognize])

  return (
    <Button
      backgroundColor="primary.500"
      borderWidth={6}
      borderStyle="solid"
      borderColor={!isRecognizing ? 'transparent' : 'primary.200'}
      onPress={async () => {
        try {
          if (!isRecognizing) await Voice.start(locale)
          else await Voice.stop()
        } catch (e: any) {
          console.log(e)
        }
      }}
      {...rest}
    >
      <Icon as={Feather} name="mic" size="sm" color="lightText" />
    </Button>
  )
}
