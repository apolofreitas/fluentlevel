import dateFormat from 'dateformat'

export function formatTime(timeInSeconds: number) {
  const timeInDate = new Date(0, 0, 0, 0, 0, timeInSeconds, 0)
  const formattedTime = dateFormat(timeInDate, 'MM:ss')
  return formattedTime
}
