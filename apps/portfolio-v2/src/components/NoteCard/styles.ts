import { cva } from 'cva'
import styles from './styles.module.css'

export const noteCardStyles = cva(
  ['transition-colors border rounded-lg', 'p-4 flex flex-col', styles.noteCard],
  {
    variants: {
      color: { gray: 'border-gray3 bg-gray1 text-gray11' },
      transluscent: {
        true: 'dark:border-grayA3 dark:bg-grayA3 dark:hover:bg-grayA4 text-gray12',
        false:
          'dark:border-gray3 dark:bg-gray3 dark:hover:bg-gray4 text-gray12',
      },
    },
    defaultVariants: {
      color: 'gray',
      transluscent: true,
    },
  }
)
