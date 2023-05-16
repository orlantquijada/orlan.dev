import { Daily } from 'contentlayer/generated'

export const likeDaily = ({ day, month }: Pick<Daily, 'month' | 'day'>) => {
  localStorage.setItem(`${month}/${day}`, JSON.stringify(true))
}
export const isDailyLiked = ({ day, month }: Pick<Daily, 'month' | 'day'>) => {
  return Boolean(localStorage.getItem(`${month}/${day}`))
}
