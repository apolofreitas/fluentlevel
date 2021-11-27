import { Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Spacer,
  Spinner,
  Text,
  TextArea,
} from 'native-base'
import Feather from 'react-native-vector-icons/Feather'
import * as yup from 'yup'
import firestore from '@react-native-firebase/firestore'
import dateFormat from 'dateformat'
import fromEntries from 'fromentries'
import { useFormik } from 'formik'

import { RootScreen } from '~/types/navigation'
import { createContest, deleteContest, getTaskById, Task, updateContest } from '~/api'
import { contestDescriptionSchema, contestTaskIdSchema, contestTitleSchema } from '~/shared/validation'
import { DatePickerButton } from '~/components/DatePickerButton'

const SaveContestSchema = yup.object({
  title: contestTitleSchema.required('O título é um campo obrigatório.'),
  description: contestDescriptionSchema,
  taskId: contestTaskIdSchema.required('A tarefa é um campo obrigatório.'),
})

export const SaveContestScreen: RootScreen<'SaveContest'> = ({ navigation, route }) => {
  const formik = useFormik({
    initialValues: route.params?.initialValues || {
      id: undefined,
      title: '',
      description: '',
      password: '',
      taskId: '',
      startDate: firestore.Timestamp.fromMillis(new Date().setSeconds(0, 0)),
      endDate: firestore.Timestamp.fromMillis(new Date().setSeconds(0, 0) + 86400000),
      ranking: [],
    },
    validationSchema: SaveContestSchema,
    validateOnChange: false,
    validate: (values) => {
      const now = firestore.Timestamp.now()
      const errors = new Map<string, string>()

      if (!formik.values.id && !isImmediateStart && values.startDate.toMillis() < now.toMillis()) {
        errors.set('startDate', 'A data inicial está no passado.')
      }

      if (values.endDate.toMillis() < now.toMillis()) {
        errors.set('endDate', 'A data final está no passado.')
      } else if (values.endDate.toMillis() < values.startDate.toMillis()) {
        errors.set('endDate', 'A data final não pode ser anterior ao dia inicial.')
      }

      return fromEntries(errors)
    },
    onSubmit: async (values) => {
      if (!!values.id) {
        await updateContest(values.id, values)
      } else {
        await createContest(values)
      }
      navigation.goBack()
    },
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isPasswordShowing, setIsPasswordShowing] = useState(false)
  const [isImmediateStart, setIsImmediateStart] = useState(!formik.values.id)

  useLayoutEffect(() => {
    if (formik.values.id === undefined) return
    const contestId = formik.values.id

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
                  'Tem certeza que deseja apagar a competição?',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                    },
                    {
                      text: 'Sair',
                      onPress: async () => {
                        await deleteContest(contestId)
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
    if (route.params?.taskToSelect === undefined) return

    const { taskToSelect } = route.params

    if (!!taskToSelect) {
      setSelectedTask(taskToSelect)
      formik.setFieldValue('taskId', taskToSelect.id, true)
    } else {
      setSelectedTask(null)
      formik.setFieldValue('taskId', '', true)
    }
  }, [route.params?.taskToSelect])

  useEffect(() => {
    if (formik.values.taskId !== '' && selectedTask === null) {
      getTaskById(formik.values.taskId)
        .then((task) => {
          if (!navigation.isFocused()) return

          setSelectedTask(task)
        })
        .catch(console.error)
    }
  }, [formik.values.taskId, selectedTask])

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
              placeholder="Título"
              onChangeText={formik.handleChange('title')}
              onBlur={formik.handleBlur('title')}
              value={formik.values.title}
              isDisabled={formik.isSubmitting}
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
              placeholder="Descrição"
              onChangeText={formik.handleChange('description')}
              onBlur={formik.handleBlur('description')}
              value={formik.values.description}
              isDisabled={formik.isSubmitting}
            />
            <FormControl.ErrorMessage>{formik.errors.description}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.password && !!formik.errors.password}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Senha (Opcional)
              </Text>
            </FormControl.Label>

            <Input
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              value={formik.values.password}
              type={isPasswordShowing ? 'text' : 'password'}
              isDisabled={formik.isSubmitting}
              InputRightElement={
                <Button
                  variant="unstyled"
                  padding={4}
                  isDisabled={formik.isSubmitting}
                  onPress={() => setIsPasswordShowing(!isPasswordShowing)}
                >
                  {isPasswordShowing ? (
                    <Icon as={Feather} name="eye-off" size={4} color="primary.500" />
                  ) : (
                    <Icon as={Feather} name="eye" size={4} color="primary.500" />
                  )}
                </Button>
              }
              placeholder="Senha"
            />

            <FormControl.HelperText>
              Deixar o campo em branco resultará em nenhuma verificação para a participação.
            </FormControl.HelperText>

            <FormControl.ErrorMessage>{formik.errors.password}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.taskId && !!formik.errors.taskId}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Tarefa
              </Text>
            </FormControl.Label>

            <Pressable onPress={() => navigation.navigate('SelectTask')}>
              <HStack
                height="46px"
                paddingX={4}
                alignItems="center"
                justifyContent="center"
                backgroundColor="card"
                borderRadius="16px"
              >
                {!formik.values.taskId ? (
                  <Icon as={Feather} name="plus" size="sm" color="primary.500" />
                ) : !!selectedTask ? (
                  <>
                    <Text color="primary.700" fontWeight="600">
                      {selectedTask.title}
                    </Text>
                    <Spacer />
                    <Text color="primary.700" fontSize="sm">
                      {selectedTask.questions.length} questões
                    </Text>
                  </>
                ) : (
                  <Spinner size="sm" />
                )}
              </HStack>
            </Pressable>

            <FormControl.ErrorMessage>{formik.errors.taskId}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.startDate && !!formik.errors.startDate}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Início
              </Text>
            </FormControl.Label>

            {!formik.values.id && (
              <Checkbox
                alignSelf="flex-start"
                marginBottom="1"
                value="isImmediateStart"
                defaultIsChecked={isImmediateStart}
                onChange={setIsImmediateStart}
                accessibilityLabel="Começar imediatamente?"
              >
                Começar imediatamente?
              </Checkbox>
            )}

            <DatePickerButton
              isDisabled={isImmediateStart || formik.isSubmitting}
              defaultValue={formik.values.startDate.toDate()}
              onPickDate={(date) => {
                formik.setFieldValue('startDate', firestore.Timestamp.fromDate(date), true)
              }}
            >
              {dateFormat(formik.values.startDate.toDate(), 'dd/mm/yyyy - HH:MM')}
            </DatePickerButton>

            <FormControl.ErrorMessage>{formik.errors.startDate}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.endDate && !!formik.errors.endDate}
            isDisabled={formik.isSubmitting}
            marginBottom={4}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Fim
              </Text>
            </FormControl.Label>

            <DatePickerButton
              isDisabled={formik.isSubmitting}
              defaultValue={formik.values.endDate.toDate()}
              onPickDate={(date) => {
                formik.setFieldValue('endDate', firestore.Timestamp.fromDate(date), true)
              }}
            >
              {dateFormat(formik.values.endDate.toDate(), 'dd/mm/yyyy - HH:MM')}
            </DatePickerButton>

            <FormControl.ErrorMessage>{formik.errors.endDate}</FormControl.ErrorMessage>
          </FormControl>
        </Box>
      </ScrollView>

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
