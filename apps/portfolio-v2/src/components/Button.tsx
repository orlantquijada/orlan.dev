import { ComponentProps, forwardRef } from 'react'
import { cva } from 'cva'
import styles from './Button.module.css'

export const buttonStyles = cva([
  'h-10 px-3 rounded-lg transition-all border border-gray7 dark:border-gray6 bg-gray1 hover:bg-gray3 dark:bg-grayA3 hover:dark:bg-grayA4 active:scale-95',
  styles.button,
])

export const Button = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(
  (props, ref) => {
    const { className, children } = props

    return (
      <button {...props} ref={ref} className={buttonStyles({ className })}>
        {children}
      </button>
    )
  }
)
