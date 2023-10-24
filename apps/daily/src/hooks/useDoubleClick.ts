import React from 'react'

// distinguishes single click from double click
// native `ondblclick` fires `onclick()` twice alongside the `ondblclick()` callback
export function useDoubleClick(
  onDoubleClick: React.MouseEventHandler<HTMLElement>,
  {
    delay = 200,
    onSingleClick,
  }: {
    delay?: number
    onSingleClick?: React.MouseEventHandler<HTMLElement>
  } = {},
) {
  const timer = React.useRef<NodeJS.Timer | null>(null)

  return React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null

        onDoubleClick(e)
      } else {
        timer.current = setTimeout(() => {
          timer.current = null
          onSingleClick?.(e)
        }, delay)
      }
    },
    [delay, onDoubleClick, onSingleClick],
  )
}
