import type { ReactNode } from 'react'
import { cva } from 'cva'
import * as DialogPrimitive from '@radix-ui/react-dialog'

const contentStyles = cva([
  'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[570px] max-h-[80vh] p-8',
  'bg-gray1 dark:bg-gray3 border border-gray7 dark:border-gray6 shadow-sm rounded-2xl',
  'z-50',
  // 'backdrop-blur-[10px] backdrop-brightness-75',
  'data-[state=open]:motion-safe:animate-showContent data-[state=closed]:motion-safe:animate-hideContent',
])

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
        <DialogPrimitive.Content className={contentStyles()}>
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
