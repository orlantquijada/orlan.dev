import type { VariantProps } from 'cva'
import type { ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { twMerge } from 'tailwind-merge'

import { chipStyles } from './styles'

export type ChipVariantProps = VariantProps<typeof chipStyles>

type Props = ChipVariantProps & {
  children: ReactNode
  className?: string | undefined
  asChild?: boolean
}

export default function Chip(props: Props) {
  const {
    color = 'gray',
    size = 'responsive',
    transluscent = true,
    children,
    asChild,
    className,
  } = props

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={twMerge(chipStyles({ color, size, transluscent, className }))}
    >
      {children}
    </Comp>
  )
}
