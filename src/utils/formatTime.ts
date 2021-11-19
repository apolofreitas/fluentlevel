import dateFormat from 'dateformat'

export interface FormatTimeOptions {
  showDetails: boolean
}

export function formatTime(timeInMs: number, options: FormatTimeOptions = { showDetails: false }) {
  const timeInDate = new Date(1, 1, 1, 0, 0, 0, timeInMs)

  if (!options.showDetails) return dateFormat(timeInDate, 'MM:ss')

  const years = Number(dateFormat(timeInDate, 'yy')) - 1
  const months = Number(dateFormat(timeInDate, 'mm')) - 2
  const days = Number(dateFormat(timeInDate, 'dd')) - 1
  const hours = dateFormat(timeInDate, 'HH')
  const minutes = dateFormat(timeInDate, 'MM')
  const seconds = dateFormat(timeInDate, 'ss')

  return `${years > 0 ? `${years} ${years === 1 ? 'ano ' : 'anos'} ` : ''}${
    months > 0 ? `${months} ${months === 1 ? 'mês' : 'meses'} ` : ''
  }${days > 0 ? `${days} ${days === 1 ? 'dia' : 'dias'} e ` : ''}${hours}:${minutes}:${seconds}`
}
