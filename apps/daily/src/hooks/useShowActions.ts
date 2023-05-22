import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { useRef, useState } from 'react'

const PAGE_OFFSET = 65

export function useShowActions() {
  const show = useShowOnScroll(PAGE_OFFSET)
  const [ref, isContentScrollable] = useIsContentScrollable()
  const isOnTabDimensions = useIsTabDimensions()

  const showActions = isContentScrollable && isOnTabDimensions ? show : true
  return [ref, showActions] as const
}

function useShowOnScroll(pageOffset = 0) {
  const [show, setShow] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const handleOnScroll = () => {
      setShow(window.scrollY > pageOffset)
    }

    window.addEventListener('scroll', handleOnScroll)
    return () => window.removeEventListener('scroll', handleOnScroll)
  }, [pageOffset])

  return show
}

// if the content overflows the viewport height
function useIsContentScrollable() {
  const [isContentScrollable, setIsContentScrollable] = useState<boolean>()
  const contentRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const htmlElement = document.querySelector('html')
    const contentClientHeight = contentRef.current?.clientHeight

    if (htmlElement && contentClientHeight)
      setIsContentScrollable(contentClientHeight > htmlElement.clientHeight)
  }, [])

  return [contentRef, Boolean(isContentScrollable)] as const
}

const TAB_WIDTH = 768

function useIsTabDimensions() {
  const [isTabDimensions, setIsTabDimensions] = useState<boolean>()

  useIsomorphicLayoutEffect(() => {
    const htmlElement = document.querySelector('html')
    if (htmlElement) setIsTabDimensions(htmlElement.clientWidth < TAB_WIDTH)
  }, [])

  return Boolean(isTabDimensions)
}
