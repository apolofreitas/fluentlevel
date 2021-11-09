import React, { useEffect, useLayoutEffect } from 'react'
import {
  Actionsheet,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Icon,
  IconButton,
  Input,
  ScrollView,
  Text,
  TextArea,
  useDisclose,
  VStack,
} from 'native-base'
import Feather from 'react-native-vector-icons/Feather'
import * as yup from 'yup'
import { useFormik } from 'formik'

import { RootScreen } from '~/types/navigation'
import { createTask, CreateTaskOptions, deleteTask, updateTask } from '~/api'
import { taskDescriptionSchema, taskQuestionsSchema, taskTitleSchema } from '~/shared/validation'
import { Alert } from 'react-native'

const SaveTaskSchema = yup.object({
  title: taskTitleSchema.required('O título é um campo obrigatório.'),
  description: taskDescriptionSchema,
  questions: taskQuestionsSchema,
})

export const SaveTaskScreen: RootScreen<'SaveTask'> = ({ navigation, route }) => {
  const saveQuestionDisclosure = useDisclose()
  const formik = useFormik<CreateTaskOptions & { id?: string }>({
    initialValues: route.params?.initialValues || {
      id: undefined,
      title: '',
      description: '',
      isPublic: false,
      questions: [],
    },
    validationSchema: SaveTaskSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!!values.id) {
        await updateTask(values.id, values)
      } else {
        await createTask(values)
      }
      navigation.goBack()
    },
  })

  useLayoutEffect(() => {
    if (formik.values.id === undefined) return
    const taskId = formik.values.id

    navigation.setOptions({
      headerRight: () => (
        <IconButton
          variant="unstyled"
          icon={
            <Icon
              as={Feather}
              name="trash"
              size="sm"
              onPress={async () => {
                Alert.alert(
                  'Apagar',
                  'Tem certeza que deseja apagar a tarefa?',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                    },
                    {
                      text: 'Sair',
                      onPress: async () => {
                        await deleteTask(taskId)
                        navigation.goBack()
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
  }, [navigation, formik.values.id])

  useEffect(() => {
    if (!route.params?.questionToSave) return

    const { questionToSave } = route.params

    // update
    if (questionToSave.index !== undefined && questionToSave.data !== undefined) {
      formik.setFieldValue(
        'questions',
        formik.values.questions.map((question, questionIndex) =>
          questionIndex === questionToSave.index ? questionToSave.data : question,
        ),
      )
    }

    // create
    if (questionToSave.index === undefined && questionToSave.data !== undefined) {
      formik.setFieldValue('questions', [...formik.values.questions, questionToSave.data])
    }

    // delete
    if (questionToSave.index !== undefined && questionToSave.data === undefined) {
      formik.setFieldValue(
        'questions',
        formik.values.questions.filter((_, questionIndex) => questionIndex !== questionToSave.index),
      )
    }
  }, [route.params?.questionToSave])

  return (
    <>
      <ScrollView>
        <Box paddingX={6} paddingTop={2} paddingBottom={24}>
          <FormControl
            isInvalid={!!formik.touched.title && !!formik.errors.title}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Título
              </Text>
            </FormControl.Label>
            <Input
              placeholder="Ex: Gírias para escola"
              onChangeText={formik.handleChange('title')}
              onBlur={formik.handleBlur('title')}
              value={formik.values.title}
            />
            <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.description && !!formik.errors.description}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Descrição (Opcional)
              </Text>
            </FormControl.Label>
            <TextArea
              height="88px"
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="Ex: Tá a fim de aprender umas novas gírias?"
              onChangeText={formik.handleChange('description')}
              onBlur={formik.handleBlur('description')}
              value={formik.values.description}
              isDisabled={formik.isSubmitting}
            />
            <FormControl.ErrorMessage>{formik.errors.description}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isDisabled={formik.isSubmitting} marginBottom={4}>
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600" marginBottom={2}>
                Outros
              </Text>
            </FormControl.Label>
            <Checkbox
              alignSelf="flex-start"
              value="is-public"
              accessibilityLabel="Visível para a comunidade"
              onChange={() => formik.setFieldValue('isPublic', !formik.values.isPublic, false)}
              isChecked={formik.values.isPublic}
              isDisabled={formik.isSubmitting}
            >
              Visível para a comunidade
            </Checkbox>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.questions && !!formik.errors.questions}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Questões
              </Text>
            </FormControl.Label>

            <VStack divider={<Divider />} backgroundColor="card" borderRadius="16px">
              {formik.values.questions.map((question, questionIndex) => (
                <Button
                  key={questionIndex}
                  _text={{ fontWeight: '500' }}
                  variant="unstyled"
                  padding={4}
                  justifyContent="flex-start"
                  isDisabled={formik.isSubmitting}
                  onPress={() => {
                    if (question.type === 'ALTERNATIVE_QUESTION') {
                      return navigation.navigate('SaveAlternativeQuestion', { initialValues: question, questionIndex })
                    }
                    if (question.type === 'LISTEN_QUESTION') {
                      return navigation.navigate('SaveListenQuestion', { initialValues: question, questionIndex })
                    }
                    if (question.type === 'SPEECH_QUESTION') {
                      return navigation.navigate('SaveSpeechQuestion', { initialValues: question, questionIndex })
                    }
                    if (question.type === 'ORGANIZE_QUESTION') {
                      return navigation.navigate('SaveOrganizeQuestion', { initialValues: question, questionIndex })
                    }
                  }}
                >
                  {`Questão ${questionIndex + 1} - ${
                    question.type === 'ALTERNATIVE_QUESTION'
                      ? 'Objetiva'
                      : question.type === 'LISTEN_QUESTION'
                      ? 'Reconhecimento de áudio'
                      : question.type === 'SPEECH_QUESTION'
                      ? 'Pronuncia'
                      : question.type === 'ORGANIZE_QUESTION'
                      ? 'Organização'
                      : ''
                  }`}
                </Button>
              ))}

              <Button
                variant="ghost"
                backgroundColor="white"
                padding={4}
                startIcon={<Icon as={Feather} name="plus" size="sm" color="primary.500" />}
                isDisabled={formik.isSubmitting}
                onPress={saveQuestionDisclosure.onOpen}
              />
            </VStack>

            <FormControl.ErrorMessage>{formik.errors.questions}</FormControl.ErrorMessage>
          </FormControl>
        </Box>
      </ScrollView>

      <Actionsheet isOpen={saveQuestionDisclosure.isOpen} onClose={saveQuestionDisclosure.onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              navigation.navigate('SaveAlternativeQuestion')
              saveQuestionDisclosure.onClose()
            }}
          >
            Questão de alternativa
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              navigation.navigate('SaveListenQuestion')
              saveQuestionDisclosure.onClose()
            }}
          >
            Questão de reconhecimento de áudio
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              navigation.navigate('SaveSpeechQuestion')
              saveQuestionDisclosure.onClose()
            }}
          >
            Questão prática de pronuncia
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              navigation.navigate('SaveOrganizeQuestion')
              saveQuestionDisclosure.onClose()
            }}
          >
            Questão de organizar
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        isLoading={formik.isSubmitting}
        onPress={formik.handleSubmit}
      >
        Salvar
      </Button>
    </>
  )
}
