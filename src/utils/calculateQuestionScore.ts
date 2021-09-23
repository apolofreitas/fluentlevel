export function calculateQuestionScore(timeToAnswer: number, timeSpent: number) {
  const score = ((timeToAnswer - timeSpent) * 10) / timeToAnswer
  const roundedScore = Math.round(score)
  return roundedScore
}
