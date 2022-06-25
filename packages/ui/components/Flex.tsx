import { styled, css } from '../stitches.config'

export const flexStyles = css({
  display: 'flex',

  variants: {
    gap: {
      1: { gap: '0.25rem' },
      2: { gap: '0.5rem' },
      3: { gap: '0.75rem' },
      4: { gap: '1rem' },
      5: { gap: '1.25rem' },
      6: { gap: '1.5rem' },
      7: { gap: '1.75rem' },
      8: { gap: '2rem' },
      9: { gap: '2.25rem' },
      10: { gap: '2.5rem' },
      11: { gap: '2.75rem' },
      12: { gap: '3rem' },
      14: { gap: '3.5rem' },
      16: { gap: '4rem' },
      20: { gap: '5rem' },
      24: { gap: '6rem' },
      28: { gap: '7rem' },
      32: { gap: '8rem' },
      36: { gap: '9rem' },
      40: { gap: '10rem' },
    },
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
      rowReverse: { flexDirection: 'row-reverse' },
      columnReverse: { flexDirection: 'column-reverse' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
  },
})

export const Flex = styled('div', flexStyles)
