import * as yup from 'yup'

export const nicknameSchema = yup.string().max(72, 'O apelido deve ter no máximo 72 caracteres.')
export const usernameSchema = yup
  .string()
  .min(4, 'O nome de usuário deve ter pelo menos 4 caracteres.')
  .max(16, 'O nome de usuário deve ter no máximo 16 caracteres.')
  .matches(/^[a-zA-Z0-9_.]+$/, 'Nome de usuário contém caracteres inválidos.')
export const userBioSchema = yup.string().max(512, 'A biografia deve ter no máximo 512 caracteres.')
export const emailSchema = yup.string().email('Email inválido.')
export const passwordSchema = yup
  .string()
  .min(6, 'A senha deve ter pelo menos 6 caracteres.')
  .max(128, 'A senha deve ter no máximo 128 caracteres.')
  .matches(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/, 'A senha deve ter uma mistura de letras e números.')

export const taskTitleSchema = yup.string().max(512, 'O titulo da tarefa deve ter no máximo 512 caracteres.')
export const taskDescriptionSchema = yup.string().max(1024, 'A descrição da tarefa deve ter no máximo 1024 caracteres.')
export const taskQuestionsSchema = yup
  .array()
  .min(1, 'A tarefa deve ter no mínimo 1 questão')
  .max(100, 'A tarefa deve ter no máximo 100 questões')

export const questionStatementSchema = yup
  .string()
  .max(1024, 'As informações da tarefa deve ter no máximo 1024 caracteres.')
export const questionAlternativesSchema = yup
  .array()
  .of(
    yup
      .string()
      .required('A alternativa deve ser preenchida.')
      .max(1024, 'A alternativa deve ter no máximo 1024 caracteres.'),
  )
  .min(2, 'A questão deve ter no mínimo 2 alternativas.')
  .max(5, 'A questão deve ter no máximo 5 alternativas.')
  .required()

export const questionPhraseToSpeechSchema = yup
  .string()
  .max(280, 'A frase para ser ditada deve ter no máximo 280 caracteres.')

export const contestTitleSchema = yup.string().max(512, 'O titulo da competição deve ter no máximo 512 caracteres.')
export const contestDescriptionSchema = yup
  .string()
  .max(1024, 'A descrição da competição deve ter no máximo 1024 caracteres.')
export const contestTaskIdSchema = yup.string()

export const phraseToRecognize = yup.string().max(280, 'A frase para ser ditada deve ter no máximo 280 caracteres.')
export const phraseToOrganize = yup.string().max(280, 'A frase para ser organizada deve ter no máximo 280 caracteres.')
