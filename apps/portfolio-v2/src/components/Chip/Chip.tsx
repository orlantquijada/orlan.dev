import type { VariantProps } from 'cva'
import type { ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { chipStyles } from './styles'

export type ChipVariantProps = VariantProps<typeof chipStyles>

type Props = ChipVariantProps & {
  children: ReactNode
  asChild?: boolean
}

export default function Chip(props: Props) {
  const {
    color = 'gray',
    size = 'responsive',
    transluscent = true,
    children,
    asChild,
  } = props

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp className={chipStyles({ color, size, transluscent })}>
      {children}
    </Comp>
  )
}