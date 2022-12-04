import { cva } from 'cva'

export const chipStyles = cva(
  [
    'grid cursor-pointer place-items-center rounded-full border leading-none transition-colors focus-within:outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-6 min-w-[2.5rem] px-2 text-xs',
        md: 'h-7 min-w-[3rem] px-3 text-sm',
        lg: 'h-8 px-4',
        responsive:
          'h-6 min-w-[2.5rem] px-2 text-xs md:h-7 md:min-w-[3rem] md:px-3 md:text-sm',
      },
      color: {
        gray: 'border-gray6 bg-gray1 text-gray11 hover:border-gray7 hover:bg-gray3',
        primary: 'border-gray12 bg-gray12 text-gray1 focus-visible:bg-grayA11',
      },
      transluscent: {
        true: 'dark:border-grayA4 dark:hover:border-grayA10 dark:focus-within:border-grayA10',
        false: 'dark:border-gray3',
      },
    },
    defaultVariants: {
      size: 'responsive',
      color: 'gray',
      transluscent: true,
    },
    compoundVariants: [
      {
        color: 'gray',
        transluscent: true,
        className: 'dark:bg-grayA3 dark:text-gray12',
      },
      {
        color: 'gray',
        transluscent: false,
        className:
          'dark:bg-gray3 dark:focus-within:bg-gray4 dark:hover:bg-gray4',
      },
    ],
  }
)
