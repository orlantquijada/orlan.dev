import { ComponentProps, forwardRef } from 'react'
import { cva, VariantProps } from 'cva'
import styles from './Button.module.css'

export const buttonStyles = cva(
  [
    'h-10 px-3 rounded-lg border border-gray7 dark:border-gray6 bg-gray1 ',
    styles.button,
  ],
  {
    variants: {
      motionSafe: {
        true: 'motion-safe:transition-all hover:bg-gray3',
      },
      translucent: {
        true: [
          'dark:bg-grayA3',
          // 'dark:backdrop-blur-md dark:backdrop-brightness-75 dark:saturate-200 dark:contrast-75',
        ],
        false: ['dark:bg-gray3'],
      },
    },
    compoundVariants: [
      {
        motionSafe: true,
        translucent: true,
        className: 'hover:dark:bg-grayA4',
      },
      {
        motionSafe: true,
        translucent: false,
        className: 'hover:dark:bg-gray4',
      },
    ],
    defaultVariants: {
      translucent: false,
      motionSafe: true,
    },
  }
)

export const Button = forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'> & VariantProps<typeof buttonStyles>
>((props, ref) => {
  const { className, children, translucent = null } = props

  return (
    <button
      {...props}
      ref={ref}
      className={buttonStyles({ className, translucent: translucent })}
    >
      {children}
    </button>
  )
})