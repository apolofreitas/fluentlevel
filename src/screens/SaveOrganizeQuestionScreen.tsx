import React, { useLayoutEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import {
  Box,
  HStack,
  Icon,
  ScrollView,
  Text,
  TextArea,
  Button,
  IconButton,
  FormControl,
  Slider,
  Input,
} from 'native-base'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Alert } from 'react-native'

import { RootScreen } from '~/types/navigation'
import { phraseToOrganize } from '~/shared/validation'
import { OrganizeQuestionModel } from '~/api'

const SaveOrganizeQuestionSchema = yup.object({
  translatedPhraseToOrganize: phraseToOrganize.required('A frase a ser traduzida um campo obrigatório.'),
  phraseToOrganize: phraseToOrganize.required('A frase para ser organizada é um campo obrigatório.'),
})

export const SaveOrganizeQuestionScreen: RootScreen<'SaveOrganizeQuestion'> = ({ navigation, route }) => {
  const [questionIndex] = useState(route.params?.questionIndex)
  const formik = useFormik<OrganizeQuestionModel>({
    initialValues: route.params?.initialValues || {
      type: 'ORGANIZE_QUESTION',
      timeToAnswer: 30,
      translatedPhraseToOrganize: '',
      phraseToOrganize: '',
    },
    validationSchema: SaveOrganizeQuestionSchema,
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
            isInvalid={!!formik.touched.translatedPhraseToOrganize && !!formik.errors.translatedPhraseToOrganize}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Frase a ser traduzida
              </Text>
            </FormControl.Label>

            <TextArea
              height="88px"
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="Ex: Olá meu nome é Paulo."
              onChangeText={formik.handleChange('translatedPhraseToOrganize')}
              onBlur={formik.handleBlur('translatedPhraseToOrganize')}
              value={formik.values.translatedPhraseToOrganize}
              isDisabled={formik.isSubmitting}
            />

            <FormControl.ErrorMessage>{formik.errors.translatedPhraseToOrganize}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.phraseToOrganize && !!formik.errors.phraseToOrganize}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Frase para ser organizada
              </Text>
            </FormControl.Label>

            <TextArea
              height="88px"
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="Ex: Hi my name is Paulo."
              onChangeText={formik.handleChange('phraseToOrganize')}
              onBlur={formik.handleBlur('phraseToOrganize')}
              value={formik.values.phraseToOrganize}
              isDisabled={formik.isSubmitting}
            />

            <FormControl.HelperText>As palavras são identificadas pela separação por espaço.</FormControl.HelperText>

            <FormControl.ErrorMessage>{formik.errors.phraseToOrganize}</FormControl.ErrorMessage>
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
