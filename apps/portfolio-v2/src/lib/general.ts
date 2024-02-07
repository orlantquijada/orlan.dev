import { cx, type CxOptions } from 'cva'
import { twMerge } from 'tailwind-merge'
import { useEffect, useLayoutEffect } from 'react'

export const isBrowser = typeof window !== 'undefined'
export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect

export function cn(...args: CxOptions) {
  return twMerge(cx(args))
}
