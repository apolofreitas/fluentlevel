import React, { useLayoutEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { Box, HStack, Icon, ScrollView, Text, TextArea, Button, IconButton, FormControl, Slider } from 'native-base'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Alert } from 'react-native'

import { RootScreen } from '~/types/navigation'
import { questionPhraseToSpeechSchema } from '~/shared/validation'
import { SpeechQuestionModel } from '~/api'
import { RecognizeAudioButton } from '~/components'

const SaveSpeechQuestionSchema = yup.object({
  phraseToSpeech: questionPhraseToSpeechSchema.required('A frase para ser ditada é um campo obrigatório.'),
})

export const SaveSpeechQuestionScreen: RootScreen<'SaveSpeechQuestion'> = ({ navigation, route }) => {
  const [questionIndex] = useState(route.params?.questionIndex)
  const formik = useFormik<SpeechQuestionModel>({
    initialValues: route.params?.initialValues || {
      type: 'SPEECH_QUESTION',
      timeToAnswer: 30,
      phraseToSpeech: '',
    },
    validationSchema: SaveSpeechQuestionSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!navigation.isFocused()) return
      navigation.navigate('SaveTask', {
        questionToSave: {
          data: values,
          index: questionIndex,
        },
      })
    },
  })

  useLayoutEffect(() => {
    if (questionIndex === undefined) return
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          variant="unstyled"
          icon={
            <Icon
              as={Feather}
              name="trash"
              size="sm"
              onPress={() => {
                Alert.alert(
                  'Apagar',
                  'Tem certeza que deseja apagar a questão?',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                    },
                    {
                      text: 'Sair',
                      onPress: async () => {
                        navigation.navigate('SaveTask', {
                          questionToSave: {
                            index: questionIndex,
                          },
                        })
                      },
                    },
                  ],
                  {
                    cancelable: true,
                  },
                )
              }}
            />
          }
        />
      ),
    })
  }, [navigation, questionIndex])

  return (
    <>
      <ScrollView>
        <Box paddingX={6} paddingTop={2} paddingBottom={24}>
          <FormControl
            isInvalid={!!formik.touched.phraseToSpeech && !!formik.errors.phraseToSpeech}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Frase para ser ditada
              </Text>
            </FormControl.Label>

            <RecognizeAudioButton
              locale="en-US"
              onRecognize={(value) => formik.setFieldValue('phraseToSpeech', value, true)}
            />

            {!!formik.values.phraseToSpeech && (
              <FormControl.Label
                _text={{
                  textTransform: 'capitalize',
                }}
              >
                {formik.values.phraseToSpeech}
              </FormControl.Label>
            )}

            <FormControl.ErrorMessage>{formik.errors.phraseToSpeech}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.timeToAnswer && !!formik.errors.timeToAnswer}
            isDisabled={formik.isSubmitting}
          >
            <HStack space={2} paddingRight={2}>
              <FormControl.Label>
                <Text color="primary.700" fontSize="lg" fontWeight="600">
                  Tempo: {formik.values.timeToAnswer}s
                </Text>
              </FormControl.Label>

              <Slider
                flexShrink={1}
                minValue={10}
                maxValue={60}
                accessibilityLabel="Time Slider"
                value={formik.values.timeToAnswer}
                onChange={(value) => formik.setFieldValue('timeToAnswer', value, false)}
                isDisabled={formik.isSubmitting}
              >
                <Slider.Track>
                  <Slider.FilledTrack />
                </Slider.Track>
                <Slider.Thumb />
              </Slider>
            </HStack>

            <FormControl.ErrorMessage>{formik.errors.timeToAnswer}</FormControl.ErrorMessage>
          </FormControl>
        </Box>
      </ScrollView>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        isLoading={formik.isSubmitting}
        isDisabled={formik.isSubmitting}
        onPress={formik.handleSubmit}
      >
        Salvar
      </Button>
    </>
  )
}
