import * as React from 'react'
import { Box, Button, Center, FormControl, Icon, Input, Text, useToast, VStack } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'
import { useFormik } from 'formik'

import { RootScreen } from '~/types/navigation'
import { signIn } from '~/api'
import { showSimpleToast } from '~/utils'

export const SignInScreen: RootScreen<'SignIn'> = ({ navigation }) => {
  const toast = useToast()
  const formik = useFormik({
    initialValues: { usernameOrEmail: '', password: '' },
    onSubmit: async (values) => {
      if (!values.usernameOrEmail) {
        return showSimpleToast(toast, 'Campo de login vazio.')
      }
      if (!values.password) {
        return showSimpleToast(toast, 'Campo de senha vazio.')
      }

      await signIn(values).catch(({ code }: { code: string }) => {
        if (code === 'auth/invalid-email') {
          showSimpleToast(toast, 'Não achamos sua conta.')
        } else if (code === 'auth/user-disabled') {
          showSimpleToast(toast, 'O usuário correspondente foi desativado.')
        } else if (code === 'auth/user-not-found') {
          showSimpleToast(toast, 'Desculpe, não conseguimos encontrar sua conta.')
        } else if (code === 'auth/wrong-password') {
          showSimpleToast(toast, 'Os dados preenchidos não correspondem aos nosso registros.')
        } else {
          showSimpleToast(toast, 'Erro inesperado, tente novamente mais tarde.')
        }
      })
    },
  })
  const [isPasswordShowing, setIsPasswordShowing] = React.useState(false)

  return (
    <Center flex={1} paddingX={6}>
      <Box width="100%">
        <Box>
          <Text fontWeight="700" fontSize="xl">
            Bem vindo
          </Text>
          <Text marginBottom={6}>Use suas informações para entrar em sua conta.</Text>
        </Box>

        <VStack space={4} marginBottom={2}>
          <FormControl isInvalid={!!formik.touched.usernameOrEmail && !!formik.errors.usernameOrEmail}>
            <Input
              onChangeText={formik.handleChange('usernameOrEmail')}
              onBlur={formik.handleBlur('usernameOrEmail')}
              value={formik.values.usernameOrEmail}
              isDisabled={formik.isSubmitting}
              placeholder="Nome de usuário ou email"
            />
            <FormControl.ErrorMessage>{formik.errors.usernameOrEmail}</FormControl.ErrorMessage>
          </FormControl>

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
        </VStack>
        <Text
          fontSize="sm"
          fontWeight="600"
          color="primary.500"
          underline
          marginLeft={1}
          marginBottom={6}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          Esqueci minha senha
        </Text>
        <Button marginX={2} isLoading={formik.isSubmitting} onPress={formik.handleSubmit}>
          Entrar
        </Button>
      </Box>
    </Center>
  )
}
