export function calculateQuestionScore(timeToAnswer: number, timeSpent: number, coefficient: number = 1) {
  const score = ((timeToAnswer - timeSpent) * 10) / timeToAnswer
  const roundedScore = Math.round(score * coefficient)
  return roundedScore
}
