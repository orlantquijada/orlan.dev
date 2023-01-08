import { Daily } from 'contentlayer/generated'

export const likeDaily = ({ day, month }: Pick<Daily, 'month' | 'day'>) => {
  localStorage.setItem(`${month}/${day}`, JSON.stringify(true))
}
