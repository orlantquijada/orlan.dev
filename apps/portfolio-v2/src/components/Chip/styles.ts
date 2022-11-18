import { cva } from 'cva'

export const chipStyles = cva(
  [
    'border rounded-full grid place-items-center leading-none cursor-pointer transition-colors',
  ],
  {
    variants: {
      size: {
        sm: 'h-6 px-2 text-xs min-w-[2.5rem]',
        md: 'h-7 px-3 text-sm min-w-[3rem]',
        lg: 'h-8 px-4',
        responsive:
          'h-6 px-2 text-xs min-w-[2.5rem] md:h-7 md:px-3 md:text-sm md:min-w-[3rem]',
      },
      color: {
        gray: 'border-gray6 hover:border-gray7 bg-gray1 hover:bg-gray3 text-gray11',
        primary:
          'border-gray10 bg-gray12 dark:bg-gray12 hover:bg-gray12 dark:hover:bg-gray11 text-gray1',
      },
      transluscent: {
        true: 'dark:border-grayA4 dark:bg-grayA3 dark:hover:bg-grayA3 dark:hover:border-grayA10 dark:text-gray12',
        false:
          'dark:border-gray3 dark:bg-gray3 dark:hover:bg-gray4 dark:text-gray11',
      },
    },
    defaultVariants: {
      size: 'responsive',
      color: 'gray',
      transluscent: true,
    },
    compoundVariants: [
      {
        color: 'primary',
        transluscent: true,
        className: 'dark:!text-gray1 dark:hover:!bg-gray12',
      },
    ],
  }
)
