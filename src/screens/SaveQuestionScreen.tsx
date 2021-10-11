import * as React from 'react'
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
  Select,
} from 'native-base'
import * as yup from 'yup'
import { useFormik } from 'formik'

import { RootScreen } from '~/types/navigation'
import { questionAlternativesSchema, questionStatementSchema } from '~/shared/validation'
import { QuestionModel } from '~/api'
import { OctopusIcon } from '~/components/OctopusIcon'
import { colors } from '~/theme/colors'
import { Alert, Pressable } from 'react-native'

const SignUpSchema = yup.object({
  statement: questionStatementSchema.required('O enunciado é um campo obrigatório.'),
  alternatives: questionAlternativesSchema.required('As alternativas são obrigatório.'),
})

export const SaveQuestionScreen: RootScreen<'SaveQuestion'> = ({ navigation, route }) => {
  const [questionIndex] = React.useState(route.params?.questionIndex)
  const formik = useFormik<QuestionModel>({
    initialValues: route.params?.initialValues || {
      statement: '',
      alternatives: [],
      rightAlternativeIndex: 0,
      timeToAnswer: 30,
    },
    validationSchema: SignUpSchema,
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

  React.useLayoutEffect(() => {
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

  React.useEffect(() => {
    const rightAlternativeIndex = Math.max(
      0,
      Math.min(formik.values.rightAlternativeIndex, formik.values.alternatives.length - 1),
    )
    formik.setFieldValue('rightAlternativeIndex', rightAlternativeIndex, false)
  }, [formik.values.alternatives])

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
            isInvalid={!!formik.touched.statement && !!formik.errors.statement}
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

            <FormControl.ErrorMessage>{formik.errors.statement}</FormControl.ErrorMessage>
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
