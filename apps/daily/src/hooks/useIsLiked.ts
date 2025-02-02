import { useState } from 'react'

import { Daily } from 'contentlayer/generated'
import { getIsLiked } from '@/lib/like'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export function useIsLiked(daily: Pick<Daily, 'day' | 'month'>) {
  const [isLiked, setIsLiked] = useState<boolean>()

  useIsomorphicLayoutEffect(() => {
    if (typeof localStorage !== 'undefined') setIsLiked(getIsLiked(daily))
  }, [])

  return [Boolean(isLiked), setIsLiked] as const
}
