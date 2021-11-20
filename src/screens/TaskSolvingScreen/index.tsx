import React, { useEffect, useState } from 'react'
import { Alert, BackHandler } from 'react-native'

import { RootScreen } from '~/types/navigation'
import { formatTime } from '~/utils/formatTime'
import { AlternativeQuestion } from './components/AlternativeQuestion'
import { ListenQuestion } from './components/ListenQuestion'
import { SpeechQuestion } from './components/SpeechQuestion'
import { OrganizeQuestion } from './components/OrganizeQuestion'

export const TaskSolvingScreen: RootScreen<'TaskSolving'> = ({ navigation, route }) => {
  const { contestId, task, results, questionIndex } = route.params
  const question = task.questions[questionIndex]
  const [score, setScore] = useState<number | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Sair',
        'Tem certeza que quer voltar? Todo o seu progresso será perdido.',
        [
          {
            text: 'Cancelar',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Sair', onPress: () => navigation.goBack() },
        ],
        {
          cancelable: true,
        },
      )
      return true
    })

    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    if (score !== null) return
    if (timeSpent >= question.timeToAnswer) return

    const timeSpentIntervalId = setInterval(() => {
      setTimeSpent((timeSpent) => timeSpent + 1)
    }, 1000)

    return () => clearInterval(timeSpentIntervalId)
  }, [score])

  useEffect(() => {
    navigation.setOptions({ title: `Tempo: ${formatTime((question.timeToAnswer - timeSpent) * 1000)}` })
  }, [timeSpent])

  const goToNextScreen = () => {
    if (!navigation.isFocused()) return

    const updatedResults = [...results, { timeSpent, isCorrectAnswered: !!score }]

    if (questionIndex < task.questions.length - 1) {
      navigation.replace('TaskSolving', {
        contestId,
        task,
        questionIndex: questionIndex + 1,
        results: updatedResults,
      })
    } else {
      const correctQuestionsAmount = updatedResults.reduce((acc, result) => acc + (result.isCorrectAnswered ? 1 : 0), 0)
      const timeSpent = updatedResults.reduce((acc, result) => acc + result.timeSpent, 0)
      const totalScore = updatedResults.reduce((acc, result) => acc + (result.isCorrectAnswered ? score || 0 : 0), 0)
      const totalTime = task.questions.reduce((acc, question) => acc + question.timeToAnswer, 0)

      navigation.replace('TaskResults', {
        contestId,
        results: {
          taskId: task.id,
          totalScore,
          timeSpent,
          totalTime,
          correctQuestionsAmount,
          questionsAmount: task.questions.length,
        },
      })
    }
  }

  if (question.type === 'ALTERNATIVE_QUESTION') {
    return (
      <AlternativeQuestion
        question={question}
        score={score || 0}
        timeSpent={timeSpent}
        isShowingResults={score !== null}
        onCalculateScore={setScore}
        onNextQuestion={goToNextScreen}
      />
    )
  }

  if (question.type === 'LISTEN_QUESTION') {
    return (
      <ListenQuestion
        question={question}
        score={score || 0}
        timeSpent={timeSpent}
        isShowingResults={score !== null}
        onCalculateScore={setScore}
        onNextQuestion={goToNextScreen}
      />
    )
  }

  if (question.type === 'SPEECH_QUESTION') {
    return (
      <SpeechQuestion
        question={question}
        score={score || 0}
        timeSpent={timeSpent}
        isShowingResults={score !== null}
        onCalculateScore={setScore}
        onNextQuestion={goToNextScreen}
      />
    )
  }

  if (question.type == 'ORGANIZE_QUESTION') {
    return (
      <OrganizeQuestion
        question={question}
        score={score || 0}
        timeSpent={timeSpent}
        isShowingResults={score !== null}
        onCalculateScore={setScore}
        onNextQuestion={goToNextScreen}
      />
    )
  }

  return null
}
