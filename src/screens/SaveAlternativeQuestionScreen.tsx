import React, { useEffect, useLayoutEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import {
  Box,
  HStack,
  Icon,
  Input,
  ScrollView,
  Text,
  TextArea,
  VStack,
  Button,
  IconButton,
  FormControl,
  Slider,
  Image,
} from 'native-base'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Alert, Pressable } from 'react-native'

import { RootScreen } from '~/types/navigation'
import { questionAlternativesSchema, questionInfoSchema } from '~/shared/validation'
import { AlternativeQuestionModel } from '~/api'
import { colors } from '~/theme/colors'
import { OctopusIcon } from '~/components'

const SaveAlternativeQuestionSchema = yup.object({
  info: questionInfoSchema.required('As informações da questão são obrigatórias.'),
  alternatives: questionAlternativesSchema.required('As alternativas são obrigatório.'),
})

export const SaveAlternativeQuestionScreen: RootScreen<'SaveAlternativeQuestion'> = ({ navigation, route }) => {
  const [questionIndex] = useState(route.params?.questionIndex)

  const formik = useFormik<AlternativeQuestionModel>({
    initialValues: route.params?.initialValues || {
      type: 'ALTERNATIVE_QUESTION',
      info: '',
      timeToAnswer: 30,
      alternatives: [],
      rightAlternativeIndex: 0,
    },
    validationSchema: SaveAlternativeQuestionSchema,
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

  useEffect(() => {
    const rightAlternativeIndex = Math.max(
      0,
      Math.min(formik.values.rightAlternativeIndex, formik.values.alternatives.length - 1),
    )
    formik.setFieldValue('rightAlternativeIndex', rightAlternativeIndex, false)
  }, [formik.values.alternatives])

  useEffect(() => {
    if (!route.params?.imageUriToSave) return

    formik.setFieldValue('imageUri', route.params?.imageUriToSave, false)
  }, [route.params?.imageUriToSave])

  return (
    <>
      <ScrollView>
        <Box paddingX={6} paddingTop={2} paddingBottom={28}>
          <FormControl
            isInvalid={!!formik.touched.info && !!formik.errors.info}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Informações
              </Text>
            </FormControl.Label>
            <TextArea
              height="88px"
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="Digite as informações da questão"
              onChangeText={formik.handleChange('info')}
              onBlur={formik.handleBlur('info')}
              value={formik.values.info}
              isDisabled={formik.isSubmitting}
            />
            <FormControl.ErrorMessage>{formik.errors.info}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.info && !!formik.errors.info}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <HStack space={2}>
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

          <FormControl
            isInvalid={!!formik.touched.alternatives && !!formik.errors.alternatives}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Alternativas
              </Text>
            </FormControl.Label>

            <VStack space={3}>
              {formik.values.alternatives.map((alternative, index) => (
                <Box key={index}>
                  <Input
                    variant="unstyled"
                    padding={0}
                    placeholder="Digite a alternativa"
                    flex={1}
                    color="gray.300"
                    height={60}
                    _focus={{ border: 'none' }}
                    value={alternative}
                    isDisabled={formik.isSubmitting}
                    onBlur={formik.handleBlur('alternatives')}
                    onChangeText={(value) => {
                      formik.setFieldValue(
                        'alternatives',
                        formik.values.alternatives.map((alternativeValue, alternativeIndex) =>
                          alternativeIndex === index ? value : alternativeValue,
                        ),
                        false,
                      )
                      formik.validateField('alternatives')
                    }}
                    InputLeftElement={
                      <Pressable onPress={() => formik.setFieldValue('rightAlternativeIndex', index, false)}>
                        <OctopusIcon
                          backgroundColor={
                            index === formik.values.rightAlternativeIndex ? colors.primary[500] : colors.gray[300]
                          }
                          borderLeftRadius={0}
                          marginRight={3}
                        />
                      </Pressable>
                    }
                    InputRightElement={
                      <Button
                        variant="unstyled"
                        padding={4}
                        isDisabled={formik.isSubmitting}
                        onPress={() =>
                          formik.setFieldValue(
                            'alternatives',
                            formik.values.alternatives.filter((_, alternativeIndex) => alternativeIndex !== index),
                            false,
                          )
                        }
                      >
                        <Icon as={Feather} name="trash" size={5} color="primary.500" />
                      </Button>
                    }
                  />

                  <FormControl.ErrorMessage>
                    {formik.errors.alternatives &&
                      typeof formik.errors.alternatives !== 'string' &&
                      formik.errors.alternatives[index]}
                  </FormControl.ErrorMessage>
                </Box>
              ))}

              {formik.values.alternatives.length < 5 && (
                <Button
                  variant="ghost"
                  backgroundColor="white"
                  padding={4}
                  startIcon={<Icon as={Feather} name="plus" size="sm" color="primary.500" />}
                  isDisabled={formik.isSubmitting}
                  onPress={() => formik.setFieldValue('alternatives', [...formik.values.alternatives, ''], false)}
                >
                  Adicionar alternativa
                </Button>
              )}
            </VStack>

            <FormControl.ErrorMessage>
              {formik.errors.alternatives &&
                typeof formik.errors.alternatives === 'string' &&
                formik.errors.alternatives}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button
            margin={2}
            startIcon={<Icon as={Feather} name="search" />}
            onPress={() => navigation.navigate('SelectImage', { screenToNavigateOnSave: 'SaveAlternativeQuestion' })}
          >
            Search image in WEB
          </Button>

          {!!formik.values.imageUri && (
            <Image
              boxSize="120px"
              borderRadius="16px"
              source={{ uri: formik.values.imageUri }}
              alt="Imagem da internet"
            />
          )}
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
