export function calculateQuestionScore(timeToAnswer: number, timeSpent: number) {
  const score = ((timeToAnswer - (timeSpent * 2) / 3) / timeToAnswer) * 15
  const roundedScore = Math.round(score)
  return roundedScore
}
