import type { ReactNode } from 'react'
import { cva } from 'cva'
import * as DialogPrimitive from '@radix-ui/react-dialog'

const contentStyles = cva(
  [
    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-(24px*2))] max-w-[570px] max-h-[80vh] p-8',
    'shadow-sm rounded-2xl border',
    'z-50',
    'data-[state=open]:motion-safe:animate-showContent data-[state=closed]:motion-safe:animate-hideContent',
  ],
  {
    variants: {
      color: {
        gray: 'bg-gray1 border-gray7',
      },
      transluscent: {
        true: 'dark:bg-grayA3 dark:backdrop-blur-md dark:backdrop-brightness-75',
        false: 'dark:bg-gray3 dark:border-gray6',
      },
    },
    defaultVariants: {
      transluscent: false,
      color: 'gray',
    },
  }
)

const overlayStyles = cva([
  'fixed inset-0 bg-overlay',
  'data-[state=open]:motion-safe:animate-show data-[state=closed]:motion-safe:animate-hide',
  'z-40',
])

type Props = {
  trigger: ReactNode
  children: ReactNode
} & DialogPrimitive.DialogProps

export function Root(props: Props) {
  const { children, trigger } = props

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayStyles()} />
        <DialogPrimitive.Content
          className={contentStyles({ transluscent: true })}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export const Trigger = DialogPrimitive.Trigger
export const Close = DialogPrimitive.Close
export const Title = DialogPrimitive.Title
export const Description = DialogPrimitive.Description
