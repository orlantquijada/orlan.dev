import { ComponentProps, forwardRef } from 'react'
import { styled } from '../stitches.config'
import { Pill } from './Pill'
import { Text } from './Text'

export const Container = styled('div', {
  border: '3px dashed $olive6',
  borderRadius: '$md',

  p: '$3',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const Tag = forwardRef<HTMLSpanElement, ComponentProps<typeof Text>>(
  (props, ref) => (
    <Text
      {...props}
      size="2xs"
      css={{
        color: '$olive9',
        fontWeight: '$bold',
        border: '2px solid $olive6',
        borderRadius: '$md',
        p: '$1 $2',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.css,
      }}
      ref={ref}
    />
  )
)

export const Title = forwardRef<
  HTMLParagraphElement,
  ComponentProps<typeof Text>
>((props, ref) => (
  <Text
    as="p"
    size="sm"
    {...props}
    css={{ color: '$olive11', ...props.css }}
    ref={ref}
  />
))

export const Close = forwardRef<HTMLButtonElement, ComponentProps<typeof Pill>>(
  (props, ref) => (
    <Pill
      size="1"
      as="button"
      {...props}
      css={{
        ml: 'auto',
        fontSize: '$2xs',
        fontWeight: '$semibold',
        ...props.css,
      }}
      ref={ref}
    />
  )
)
