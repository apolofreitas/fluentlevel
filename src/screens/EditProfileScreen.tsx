import React from 'react'
import * as yup from 'yup'
import { Button, FormControl, Input, ScrollView, Text, TextArea, useToast, VStack } from 'native-base'
import { useFormik } from 'formik'

import { RootScreen } from '~/types/navigation'
import { nicknameSchema, userBioSchema, usernameSchema } from '~/shared/validation'
import { useCurrentUser } from '~/hooks'
import { checkUsernameAvailability, updateCurrentUser } from '~/api'
import { showSimpleToast } from '~/utils/showSimpleToast'

const EditProfileSchema = yup.object({
  nickname: nicknameSchema.required('O apelido é um campo obrigatório'),
  username: usernameSchema.required('O nome de usuário é um campo obrigatório'),
  bio: userBioSchema,
})

export const EditProfileScreen: RootScreen<'EditProfile'> = ({ navigation }) => {
  const toast = useToast()
  const { currentUser } = useCurrentUser()
  const formik = useFormik({
    initialValues: {
      nickname: currentUser.nickname,
      username: currentUser.username,
      bio: currentUser.bio,
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values) => {
      values.username = values.username.toLowerCase()
      if (values.username !== currentUser.username) {
        const isUsernameAvailable = await checkUsernameAvailability(values.username)
        if (!isUsernameAvailable) return showSimpleToast(toast, 'Nome de usuário indisponível')
      }
      await updateCurrentUser(values)
      showSimpleToast(toast, 'Mudanças salvas')
      navigation.goBack()
    },
  })

  return (
    <>
      <ScrollView>
        <VStack paddingY={2} paddingX={6} paddingBottom={24} space={2}>
          <FormControl
            isInvalid={!!formik.touched.nickname && !!formik.errors.nickname}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Apelido
              </Text>
            </FormControl.Label>
            <Input
              value={formik.values.nickname}
              onChangeText={formik.handleChange('nickname')}
              onBlur={formik.handleBlur('nickname')}
              placeholder="Apelido"
            />
            <FormControl.ErrorMessage>{formik.errors.nickname}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.touched.username && !!formik.errors.username}
            isDisabled={formik.isSubmitting}
          >
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Nome de usuário
              </Text>
            </FormControl.Label>
            <Input
              value={formik.values.username}
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              placeholder="Nome de usuário"
            />
            <FormControl.ErrorMessage>{formik.errors.username}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formik.touched.bio && !!formik.errors.bio} isDisabled={formik.isSubmitting}>
            <FormControl.Label>
              <Text color="primary.700" fontSize="lg" fontWeight="600">
                Biografia
              </Text>
            </FormControl.Label>
            <TextArea
              height="88px"
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="Biografia"
              onChangeText={formik.handleChange('bio')}
              onBlur={formik.handleBlur('bio')}
              value={formik.values.bio}
              isDisabled={formik.isSubmitting}
            />
            <FormControl.ErrorMessage>{formik.errors.bio}</FormControl.ErrorMessage>
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
