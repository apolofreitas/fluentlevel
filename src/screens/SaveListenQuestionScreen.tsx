import React, { useLayoutEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { Box, HStack, Icon, ScrollView, Text, TextArea, Button, IconButton, FormControl, Slider } from 'native-base'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Alert } from 'react-native'

import { RootScreen } from '~/types/navigation'
import { questionPhraseToSpeechSchema } from '~/shared/validation'
import { ListenQuestionModel } from '~/api'
import { RecognizeAudioButton } from '~/components'

const SaveListenQuestionSchema = yup.object({
  phraseToRecognize: questionPhraseToSpeechSchema.required('A frase para ser reconhecida é um campo obrigatório.'),
})

export const SaveListenQuestionScreen: RootScreen<'SaveListenQuestion'> = ({ navigation, route }) => {
  const [questionIndex] = useState(route.params?.questionIndex)
  const formik = useFormik<ListenQuestionModel>({
    initialValues: route.params?.initialValues || {
      type: 'LISTEN_QUESTION',
      timeToAnswer: 30,
      phraseToRecognize: '',
    },
    validationSchema: SaveListenQuestionSchema,
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
            isInvalid={!!formik.touched.phraseToRecognize && !!formik.errors.phraseToRecognize}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Frase para ser reconhecida
              </Text>
            </FormControl.Label>

            <RecognizeAudioButton
              locale="en-US"
              onRecognize={(value) => formik.setFieldValue('phraseToRecognize', value, true)}
            />

            {!!formik.values.phraseToRecognize && (
              <FormControl.Label
                _text={{
                  textTransform: 'capitalize',
                }}
              >
                {formik.values.phraseToRecognize}
              </FormControl.Label>
            )}

            <FormControl.ErrorMessage>{formik.errors.phraseToRecognize}</FormControl.ErrorMessage>
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
