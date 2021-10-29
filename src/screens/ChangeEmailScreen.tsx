import React, { useState } from 'react'
import * as yup from 'yup'
import { Button, FormControl, Icon, Input, ScrollView, Text, useToast, VStack } from 'native-base'

import { RootScreen } from '~/types/navigation'
import { useFormik } from 'formik'
import { useCurrentUser } from '~/hooks'
import { changeEmail } from '~/api'
import { emailSchema } from '~/shared/validation'
import { showSimpleToast } from '~/utils'
import Feather from 'react-native-vector-icons/Feather'

const ChangeEmailSchema = yup.object({
  newEmail: emailSchema.required('O email é campo obrigatório.'),
  actualPassword: yup.string().required('A senha atual é campo obrigatório.'),
})

export const ChangeEmailScreen: RootScreen<'ChangeEmail'> = ({ navigation }) => {
  const toast = useToast()
  const [isShowingActualPassword, setIsShowingActualPassword] = useState(false)
  const { currentUser } = useCurrentUser()
  const formik = useFormik({
    initialValues: {
      newEmail: currentUser.email,
      actualPassword: '',
    },
    validationSchema: ChangeEmailSchema,
    onSubmit: async (values) => {
      try {
        await changeEmail(values)
        navigation.goBack()
        showSimpleToast(toast, 'Email salvo.')
      } catch (e: any) {
        if (e.code === 'auth/wrong-password') showSimpleToast(toast, 'A senha não coincide')
        if (e.code === 'auth/invalid-email') showSimpleToast(toast, 'Email inválido')
        if (e.code === 'auth/too-many-requests') showSimpleToast(toast, 'Muitas tentativas, tente novamente mais tarde')
      }
    },
  })

  return (
    <>
      <ScrollView>
        <VStack paddingY={2} paddingX={6} paddingBottom={24} space={2}>
          <FormControl
            isInvalid={!!formik.touched.newEmail && !!formik.errors.newEmail}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Email
              </Text>
            </FormControl.Label>
            <Input
              value={formik.values.newEmail}
              onChangeText={formik.handleChange('newEmail')}
              onBlur={formik.handleBlur('newEmail')}
              placeholder="Email"
            />
            <FormControl.ErrorMessage>{formik.errors.newEmail}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.actualPassword && !!formik.errors.actualPassword}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Senha atual
              </Text>
            </FormControl.Label>
            <Input
              onChangeText={formik.handleChange('actualPassword')}
              onBlur={formik.handleBlur('actualPassword')}
              value={formik.values.actualPassword}
              isDisabled={formik.isSubmitting}
              type={isShowingActualPassword ? 'text' : 'password'}
              InputRightElement={
                <Button
                  variant="unstyled"
                  padding={4}
                  isDisabled={formik.isSubmitting}
                  onPress={() => setIsShowingActualPassword(!isShowingActualPassword)}
                >
                  {isShowingActualPassword ? (
                    <Icon as={Feather} name="eye-off" size={4} color="primary.500" />
                  ) : (
                    <Icon as={Feather} name="eye" size={4} color="primary.500" />
                  )}
                </Button>
              }
              placeholder="Senha atual"
            />
            <FormControl.ErrorMessage>{formik.errors.actualPassword}</FormControl.ErrorMessage>
          </FormControl>
        </VStack>
      </ScrollView>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        isDisabled={formik.isSubmitting}
        onPress={formik.handleSubmit}
      >
        Salvar
      </Button>
    </>
  )
}
