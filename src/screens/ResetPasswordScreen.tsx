import * as React from 'react'
import { Box, Button, Center, Input, useToast } from 'native-base'
import { useFormik } from 'formik'
import { useNavigation } from '@react-navigation/core'

import api from '~/api'
import { showSimpleToast } from '~/utils'

export function ResetPasswordScreen() {
  const navigation = useNavigation()
  const toast = useToast()
  const formik = useFormik({
    initialValues: { email: '' },
    onSubmit: async (values) => {
      if (!values.email) return showSimpleToast(toast, 'Campo de email vazio.')

      await api.auth
        .resetPassword(values)
        .then(() => {
          navigation.goBack()
          showSimpleToast(toast, 'Email de recuperação de senha enviado.')
        })
        .catch(({ code }: { code: string }) => {
          if (code === 'auth/invalid-email') {
            showSimpleToast(toast, 'Email inválido.')
          } else if (code === 'auth/user-not-found') {
            showSimpleToast(toast, 'Desculpe, não conseguimos encontrar sua conta.')
          } else {
            showSimpleToast(toast, 'Erro inesperado, tente novamente mais tarde.')
          }
        })
    },
  })

  return (
    <Center flex={1} paddingX="24px">
      <Box width="100%">
        <Input
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          value={formik.values.email}
          isDisabled={formik.isSubmitting}
          placeholder="Email"
          marginBottom="24px"
        />

        <Button marginX="8px" isLoading={formik.isSubmitting} isLoadingText="Enviando" onPress={formik.handleSubmit}>
          Enviar email
        </Button>
      </Box>
    </Center>
  )
}
