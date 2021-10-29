import React, { useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import Voice from '@react-native-voice/voice'
import { Button, IButtonProps, Icon, useToast } from 'native-base'
import { showSimpleToast } from '~/utils'

interface RecognizeAudioButtonProps extends IButtonProps {
  locale: 'pt-BR' | 'en-US'
  onRecognize?: (value: string) => void
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

      if (error.code === '9') {
        // TODO: ASK FOR PERMISSION?
      }

      if (error.message) {
        showSimpleToast(toast, `Error ${error.message}`.split('/').join(': '))
      } else {
        showSimpleToast(toast, `Error: Unexpected Behavior`)
      }
    }
    Voice.onSpeechResults = (e) => {
      if (!onRecognize) return
      if (!e.value) return
      const [bestMatch] = e.value
      if (!bestMatch) return
      onRecognize(bestMatch)
    }

    return () => {
      Voice.removeAllListeners()
      Voice.cancel().then(() => Voice.destroy())
    }
  }, [onRecognize])

  return (
    <Button
      backgroundColor="primary.500"
      borderWidth={4}
      borderStyle="solid"
      borderColor={!isRecognizing ? 'transparent' : 'primary.300'}
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
