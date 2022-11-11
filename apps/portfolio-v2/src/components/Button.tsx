import { ComponentProps, forwardRef } from 'react'
import { cva, VariantProps } from 'cva'
import styles from './Button.module.css'

export const buttonStyles = cva(
  [
    'h-10 px-3 rounded-lg transition-all border border-gray7 dark:border-gray6 bg-gray1 hover:bg-gray3',
    styles.button,
  ],
  {
    variants: {
      translucent: {
        true: [
          'dark:bg-grayA3 hover:dark:bg-grayA4',
          // 'dark:backdrop-blur-md dark:backdrop-brightness-75 dark:saturate-200 dark:contrast-75',
        ],
        false: [' dark:bg-gray3 hover:dark:bg-gray4'],
      },
    },
    defaultVariants: {
      translucent: false,
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
