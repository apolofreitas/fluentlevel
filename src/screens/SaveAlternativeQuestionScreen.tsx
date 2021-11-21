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
import { questionAlternativesSchema, questionStatementSchema } from '~/shared/validation'
import { AlternativeQuestionModel } from '~/api'
import { colors } from '~/theme/colors'
import { OctopusIcon } from '~/components'

const SaveAlternativeQuestionSchema = yup.object({
  statement: questionStatementSchema.required('O enunciado da questão é obrigatório.'),
  alternatives: questionAlternativesSchema.required('As alternativas são obrigatórias.'),
})

export const SaveAlternativeQuestionScreen: RootScreen<'SaveAlternativeQuestion'> = ({ navigation, route }) => {
  const [questionIndex] = useState(route.params?.questionIndex)

  const formik = useFormik<AlternativeQuestionModel>({
    initialValues: route.params?.initialValues || {
      type: 'ALTERNATIVE_QUESTION',
      statement: '',
      timeToAnswer: 30,
      alternatives: [],
      rightAlternativeIndex: 0,
      imageUri: undefined,
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
                      onPress: () => {
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
        <Box paddingX={6} paddingTop={2} paddingBottom={24}>
          <FormControl
            isInvalid={!!formik.touched.statement && !!formik.errors.statement}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Enunciado
              </Text>
            </FormControl.Label>
            <TextArea
              height="88px"
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="Digite o enunciado da questão"
              onChangeText={formik.handleChange('statement')}
              onBlur={formik.handleBlur('statement')}
              value={formik.values.statement}
              isDisabled={formik.isSubmitting}
            />
            <FormControl.ErrorMessage>{formik.errors.statement}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.timeToAnswer && !!formik.errors.timeToAnswer}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
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

          <FormControl marginBottom={4}>
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Imagem (Opcional):
              </Text>
            </FormControl.Label>

            <Pressable
              onPress={() => {
                if (!formik.values.imageUri) {
                  return navigation.navigate('SelectImage', { screenToNavigateOnSave: 'SaveAlternativeQuestion' })
                }

                Alert.alert(
                  'Imagem',
                  'O que deseja fazer com a imagem?',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                    },
                    {
                      text: 'Remover',
                      onPress: () => {
                        formik.setFieldValue('imageUri', undefined, false)
                      },
                    },
                    {
                      text: 'Trocar',
                      onPress: () => {
                        navigation.navigate('SelectImage', { screenToNavigateOnSave: 'SaveAlternativeQuestion' })
                      },
                    },
                  ],
                  {
                    cancelable: true,
                  },
                )
              }}
            >
              <Box
                height={24}
                width={32}
                backgroundColor="card"
                borderRadius="16px"
                alignItems="center"
                justifyContent="center"
              >
                {!!formik.values.imageUri && (
                  <Image
                    height="100%"
                    width="100%"
                    borderRadius="16px"
                    source={{ uri: formik.values.imageUri }}
                    alt="Imagem da internet"
                  />
                )}

                <Box
                  position="absolute"
                  top={0}
                  bottom={0}
                  left={0}
                  right={0}
                  backgroundColor="card"
                  opacity={0.25}
                  alignItems="center"
                  justifyContent="center"
                />

                <Icon position="absolute" as={Feather} name="image" />
              </Box>
            </Pressable>
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

              {formik.values.alternatives.length < 4 && (
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
