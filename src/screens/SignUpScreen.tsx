import * as React from 'react'
import { useState } from 'react'
import { useFormik } from 'formik'
import Feather from 'react-native-vector-icons/Feather'
import { Box, Button, Center, FormControl, Input, useToast, VStack } from 'native-base'
import * as yup from 'yup'

import api from '~/api'
import { colors } from '~/theme/colors'
import { nicknameSchema, emailSchema, passwordSchema, usernameSchema } from '~/shared/validation'
import { showSimpleToast } from '~/utils'

const SignUpSchema = yup.object({
  nickname: nicknameSchema.required('O apelido é um campo obrigatório'),
  username: usernameSchema.required('O nome de usuário é um campo obrigatório'),
  email: emailSchema.required('O email é campo obrigatório'),
  password: passwordSchema.required('A senha é campo obrigatório'),
})

export function SignUpScreen() {
  const toast = useToast()
  const formik = useFormik({
    initialValues: { nickname: '', username: '', email: '', password: '' },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      await api.auth.signUp(values).catch(({ code }: { code: string }) => {
        if (code === 'auth/email-already-in-use') {
          showSimpleToast(toast, 'Email já cadastrado')
        } else if (code === 'auth/invalid-email') {
          showSimpleToast(toast, 'Email inválido')
        } else if (code === 'auth/weak-password') {
          showSimpleToast(toast, 'A senha deve ter uma mistura de letras maiúsculas, letras minúsculas e números')
        }
      })
    },
  })
  const [isPasswordShowing, setIsPasswordShowing] = useState(false)

  return (
    <Center flex={1} paddingX="32px">
      <Box width="100%">
        <VStack space={4} width="100%" marginBottom="32px">
          <FormControl
            isInvalid={!!formik.touched.nickname && !!formik.errors.nickname}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>Apelido</FormControl.Label>
            <Input
              onChangeText={formik.handleChange('nickname')}
              onBlur={formik.handleBlur('nickname')}
              value={formik.values.nickname}
              placeholder="Apelido"
            />
            <FormControl.ErrorMessage>{formik.errors.nickname}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.username && !!formik.errors.username}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>Nome de usuário</FormControl.Label>
            <Input
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              value={formik.values.username}
              placeholder="Nome de usuário"
            />
            <FormControl.ErrorMessage>{formik.errors.username}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formik.touched.email && !!formik.errors.email} isDisabled={formik.isSubmitting}>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              value={formik.values.email}
              placeholder="Email"
            />
            <FormControl.ErrorMessage>{formik.errors.email}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.password && !!formik.errors.password}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>Senha</FormControl.Label>
            <Input
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              value={formik.values.password}
              type={isPasswordShowing ? 'text' : 'password'}
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
            <FormControl.ErrorMessage>{formik.errors.password}</FormControl.ErrorMessage>
          </FormControl>
        </VStack>
        <Button
          width="100%"
          isLoading={formik.isSubmitting}
          isLoadingText="Criando conta"
          onPress={formik.handleSubmit}
        >
          Criar Conta
        </Button>
      </Box>
    </Center>
  )
}
