import { Daily, allDailies } from 'contentlayer/generated'
import { getKey, parseKey } from './api'
import { Month } from './contentlayer'

///////////////////////// util /////////////////////////

type BetterTypedDaily = Daily & { month: Month }

///////////////////////// api /////////////////////////

export const like = (daily: Pick<Daily, 'month' | 'day'>) => {
  localStorage.setItem(getKey(daily), JSON.stringify(true))
}
export const removeLike = (daily: Pick<Daily, 'month' | 'day'>) => {
  return localStorage.removeItem(getKey(daily))
}
export const getIsLiked = (daily: Pick<Daily, 'month' | 'day'>) => {
  return Boolean(localStorage.getItem(getKey(daily)))
}
export const getAllLiked = () => {
  type Like = Pick<BetterTypedDaily, 'month' | 'day'>
  const likes: Like[] = []

  Object.keys(localStorage).forEach((key) => {
    const parsedKey = parseKey(key)
    if (parsedKey.success) {
      likes.push(parsedKey.data)
    }
  })
  return likes.map((like) =>
    allDailies.find(
      ({ month, day }) => month === like.month && day === like.day,
    ),
  ) as Daily[]
}
