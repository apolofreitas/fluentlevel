import * as React from 'react'
import { Box, Button, Center, FormControl, Input, Text, useToast, VStack } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'
import { useFormik } from 'formik'
import { useNavigation } from '@react-navigation/core'

import { colors } from '~/theme/colors'
import api from '~/api'
import { showSimpleToast } from '~/utils'

export function SignInScreen() {
  const navigation = useNavigation()
  const toast = useToast()
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      if (!values.email) return showSimpleToast(toast, 'Campo de email vazio.')
      if (!values.password) return showSimpleToast(toast, 'Campo de senha vazio.')

      await api.auth.signIn(values).catch(({ code }: { code: string }) => {
        if (code === 'auth/invalid-email') {
          showSimpleToast(toast, 'Email inválido.')
        } else if (code === 'auth/user-disabled') {
          showSimpleToast(toast, 'O usuário correspondente ao email foi desativado.')
        } else if (code === 'auth/user-not-found') {
          showSimpleToast(toast, 'Desculpe, não conseguimos encontrar sua conta.')
        } else if (code === 'auth/wrong-password') {
          showSimpleToast(toast, 'Senha não corresponde ao email inserido.')
        } else {
          showSimpleToast(toast, 'Erro inesperado, tente novamente mais tarde.')
        }
      })
    },
  })
  const [isPasswordShowing, setIsPasswordShowing] = React.useState(false)

  return (
    <Center flex={1} paddingX="24px">
      <Box width="100%">
        <VStack space={4} width="100%" marginBottom="8px">
          <FormControl isInvalid={!!formik.touched.email && !!formik.errors.email}>
            <Input
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              value={formik.values.email}
              isDisabled={formik.isSubmitting}
              placeholder="Email"
            />
            <FormControl.ErrorMessage>{formik.errors.email}</FormControl.ErrorMessage>
          </FormControl>

          <Input
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            value={formik.values.password}
            type={isPasswordShowing ? 'text' : 'password'}
            isDisabled={formik.isSubmitting}
            InputRightElement={
              <Button variant="unstyled" onPress={() => setIsPasswordShowing(!isPasswordShowing)}>
                {isPasswordShowing ? (
                  <Feather name="eye-off" size={16} color={colors.primary[500]} />
                ) : (
                  <Feather name="eye" size={16} color={colors.primary[500]} />
                )}
              </Button>
            }
            placeholder="Senha"
          />
        </VStack>
        <Text
          fontSize="sm"
          fontWeight="600"
          color="primary.500"
          underline
          marginLeft="4px"
          marginBottom="24px"
          onPress={() => navigation.navigate('ResetPassword')}
        >
          Esqueci minha senha
        </Text>
        <Button marginX="8px" isLoading={formik.isSubmitting} isLoadingText="Entrando" onPress={formik.handleSubmit}>
          Entrar
        </Button>
      </Box>
    </Center>
  )
}
