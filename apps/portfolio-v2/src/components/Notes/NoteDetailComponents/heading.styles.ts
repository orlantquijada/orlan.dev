import { cva } from 'cva'

export const styles = cva(['relative font-medium scroll-mt-28'], {
  variants: {
    tag: {
      h2: 'mt-24 mb-8 text-2xl before:absolute before:left-0 before:-top-3 before:h-[2px] before:w-6 before:bg-current before:rounded-sm',
      h3: 'mt-8 mb-6 text-xl',
    },
  },
})
