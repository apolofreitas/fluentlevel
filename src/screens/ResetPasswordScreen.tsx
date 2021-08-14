import * as React from 'react'
import { Box, Button, Center, FormControl, Input, Text, useToast } from 'native-base'
import { useFormik } from 'formik'
import { useNavigation } from '@react-navigation/core'

import { showSimpleToast } from '~/utils'
import { resetPassword } from '~/api'

export function ResetPasswordScreen() {
  const navigation = useNavigation()
  const toast = useToast()
  const formik = useFormik({
    initialValues: { email: '' },
    onSubmit: async (values) => {
      if (!values.email) {
        return showSimpleToast(toast, 'Campo de email vazio.')
      }

      await resetPassword(values)
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
    <Center flex={1} paddingX={6}>
      <Box width="100%">
        <Box>
          <Text fontWeight="700" fontSize="xl">
            Esqueceu sua senha?
          </Text>
          <Text marginBottom={6}>Informe-nos o endereço de email associado a sua conta.</Text>
        </Box>

        <FormControl marginBottom={6}>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            value={formik.values.email}
            placeholder="Email"
          />
        </FormControl>

        <Button marginX={2} isLoading={formik.isSubmitting} onPress={formik.handleSubmit}>
          Recuperar senha
        </Button>
      </Box>
    </Center>
  )
}
