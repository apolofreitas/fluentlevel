import React, { useState } from 'react'
import { Button, FormControl, Icon, Input, ScrollView, Text, useToast, VStack } from 'native-base'
import * as yup from 'yup'
import Feather from 'react-native-vector-icons/Feather'

import { RootScreen } from '~/types/navigation'
import { passwordSchema } from '~/shared/validation'
import { useFormik } from 'formik'
import { changePassword } from '~/api'
import { showSimpleToast } from '~/utils'

const ChangePasswordSchema = yup.object({
  actualPassword: yup.string().required('A senha atual é campo obrigatório.'),
  newPassword: passwordSchema.required('A nova senha é campo obrigatório.'),
})

export const ChangePasswordScreen: RootScreen<'ChangePassword'> = ({ navigation }) => {
  const toast = useToast()
  const [isShowingActualPassword, setIsShowingActualPassword] = useState(false)
  const [isShowingNewPassword, setIsShowingNewPassword] = useState(false)
  const formik = useFormik({
    initialValues: {
      actualPassword: '',
      newPassword: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: async (values) => {
      try {
        await changePassword(values)
        navigation.goBack()
        showSimpleToast(toast, 'Senha salva.')
      } catch (e: any) {
        if (e.code === 'auth/weak-password')
          showSimpleToast(toast, 'A senha deve ter uma mistura de letras maiúsculas, letras minúsculas e números')
        if (e.code === 'auth/wrong-password') showSimpleToast(toast, 'A senha não coincide')
        if (e.code === 'auth/too-many-requests') showSimpleToast(toast, 'Muitas tentativas, tente novamente mais tarde')
      }
    },
  })

  return (
    <>
      <ScrollView>
        <VStack paddingY={2} paddingX={6} paddingBottom={24} space={2}>
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

          <FormControl
            isInvalid={!!formik.touched.newPassword && !!formik.errors.newPassword}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Nova senha
              </Text>
            </FormControl.Label>
            <Input
              onChangeText={formik.handleChange('newPassword')}
              onBlur={formik.handleBlur('newPassword')}
              value={formik.values.newPassword}
              isDisabled={formik.isSubmitting}
              type={isShowingNewPassword ? 'text' : 'password'}
              InputRightElement={
                <Button
                  variant="unstyled"
                  padding={4}
                  isDisabled={formik.isSubmitting}
                  onPress={() => setIsShowingNewPassword(!isShowingNewPassword)}
                >
                  {isShowingNewPassword ? (
                    <Icon as={Feather} name="eye-off" size={4} color="primary.500" />
                  ) : (
                    <Icon as={Feather} name="eye" size={4} color="primary.500" />
                  )}
                </Button>
              }
              placeholder="Nova senha"
            />
            <FormControl.ErrorMessage>{formik.errors.newPassword}</FormControl.ErrorMessage>
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
