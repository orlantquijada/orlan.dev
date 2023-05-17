import { Daily } from 'contentlayer/generated'

export const like = ({ day, month }: Pick<Daily, 'month' | 'day'>) => {
  localStorage.setItem(`${month}/${day}`, JSON.stringify(true))
}
export const getIsLiked = ({ day, month }: Pick<Daily, 'month' | 'day'>) => {
  return Boolean(localStorage.getItem(`${month}/${day}`))
}
export const removeLike = ({ day, month }: Pick<Daily, 'month' | 'day'>) => {
  return Boolean(localStorage.removeItem(`${month}/${day}`))
}
