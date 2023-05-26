import { useEffect, useState } from 'react'

import { getAllLiked } from '@/lib/like'
import { Daily } from 'contentlayer/generated'

export function useLikes() {
  const [likes, setLikes] = useState<Daily[]>([])

  useEffect(() => {
    if (typeof localStorage === 'object') setLikes(getAllLiked())
  }, [])

  return likes
}
