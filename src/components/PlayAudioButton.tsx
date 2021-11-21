import React, { useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import Tts from 'react-native-tts'
import { Button, IButtonProps, Icon } from 'native-base'

interface PlayAudioButtonProps extends IButtonProps {
  locale: 'pt-BR' | 'en-US'
  textToSpeech: string
}

export const PlayAudioButton: React.FC<PlayAudioButtonProps> = ({ locale, textToSpeech, ...rest }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    Tts.setDefaultLanguage(locale)
    Tts.setDefaultRate(0.25)
    Tts.setDefaultPitch(1)
    Tts.setDucking(true)

    const onTtsFinish = () => setIsPlaying(false)

    Tts.addEventListener('tts-finish', onTtsFinish)

    return () => {
      Tts.removeEventListener('tts-finish', onTtsFinish)
    }
  }, [locale])

  return (
    <Button
      backgroundColor={!isPlaying ? 'primary.500' : 'primary.600'}
      onPress={async () => {
        if (!isPlaying) {
          setIsPlaying(true)
          Tts.speak(textToSpeech)
        } else {
          setIsPlaying(false)
          Tts.stop()
        }
      }}
      {...rest}
    >
      <Icon as={Feather} name={!isPlaying ? 'play' : 'square'} size="sm" color="lightText" />
    </Button>
  )
}
