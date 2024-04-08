import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { cva, css, cx } from 'styled-system/css'
import CheckSvg from './CheckSvg'

export default function Checkbox({ label, id }: { id: string; label: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        gap: '2',
      })}
    >
      <RadixCheckbox.Root id={id} className={checkboxStyles()}>
        {/* <RadixCheckbox.Indicator> */}
        {/*   <CheckSvg className={iconStyles()} /> */}
        {/* </RadixCheckbox.Indicator> */}

        <CheckSvg
          className={cx(
            css(iconStyles.raw(), {
              position: 'absolute',
              color: 'transparent',
              transition: 'color .2s cubic-bezier(.6,.6,0,1)',
            }),
            'check',
          )}
        />
      </RadixCheckbox.Root>

      {/* 
        NOTE: multiline line-through only works on `display: inline` so a wrapper `div` is necessary 
        - also must not be a child of `display: flex`
      */}
      <div>
        <label htmlFor={id} className={labelStyles()}>
          {label}
        </label>
      </div>
    </div>
  )
}

const checkboxStyles = cva({
  base: {
    // NOTE: hacky
    mt: '.375rem',

    '--size': '1rem',
    w: 'var(--size)',
    h: 'var(--size)',
    borderRadius: 'sm',
    background: 'transparent',
    '--boxShadowColor': 'colors.olive.6',
    boxShadow: '0 0 0 1px var(--boxShadowColor)',
    flexShrink: 0,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    transition:
      'background-color .2s cubic-bezier(.6,.6,0,1),box-shadow .2s cubic-bezier(.6,.6,0,1)',

    '& + div > label': {
      backgroundImage: 'linear-gradient(currentColor,currentColor)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center left',
      backgroundSize: '0% 2px',
      transition: 'background-size .5s cubic-bezier(.6,.6,0,1)',
      fontSize: 'lg',
    },

    '&[data-state=checked]': {
      background: 'olive.8',
      '--boxShadowColor': 'colors.olive.8',
      textDecoration: 'line-through',

      '& + div > label': {
        color: 'olive.8',
        position: 'relative',
        backgroundSize: '100% 2px',
      },

      '& .check': {
        color: 'olive.4',
      },
    },
    '&[data-state=unchecked]': {
      _hover: {
        background: 'olive.3',

        '& .check': {
          color: 'olive.7',
        },
      },
    },
  },
})

const iconStyles = cva({
  base: {
    color: 'olive.11',
    '--size': '0.75rem',
    w: 'var(--size)',
    h: 'var(--size)',
  },
})

const labelStyles = cva({
  base: {
    transition: 'color .2s cubic-bezier(.6,.6,0,1)',
    w: 'full',
  },
})
