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

export const taskTitleSchema = yup.string().max(72, 'O titulo da tarefa deve ter no máximo 72 caracteres.')
export const taskDescriptionSchema = yup.string().max(128, 'A descrição da tarefa deve ter no máximo 72 caracteres.')
export const taskQuestionsSchema = yup
  .array()
  .min(2, 'A tarefa deve ter no mínimo duas questões')
  .max(20, 'A tarefa deve ter no máximo questões')

export const questionStatementSchema = yup.string().max(128, 'O enunciado da tarefa deve ter no máximo 72 caracteres.')
export const questionAlternativesSchema = yup
  .array()
  .of(
    yup
      .string()
      .required('A alternativa deve ser preenchida.')
      .max(128, 'A alternativa deve ter no máximo 72 caracteres.'),
  )
  .min(2, 'Deve haver no mínimo 2 alternativas em uma questão.')
  .max(5, 'Deve haver no máximo 5 alternativas em uma questão.')
  .required()
