import * as yup from 'yup'

export const nicknameSchema = yup.string().max(72, 'O apelido deve ter no máximo 72 caracteres.')
export const usernameSchema = yup
  .string()
  .min(4, 'O nome de usuário deve ter pelo menos 4 caracteres.')
  .max(16, 'O nome de usuário deve ter no máximo 16 caracteres.')
  .matches(/^[a-zA-Z0-9_.]+$/, 'Nome de usuário contém caracteres inválidos.')
export const emailSchema = yup.string().email('Email inválido.')
export const passwordSchema = yup
  .string()
  .min(6, 'A senha deve ter pelo menos 6 caracteres.')
  .max(128, 'A senha deve ter no máximo 128 caracteres.')
  .matches(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/, 'A senha deve ter uma mistura de letras e números.')
