import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig, Variants } from 'framer-motion'
import { cva } from 'cva'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { transitions } from '@/utils/motion'

import styles from './styles.module.css'
import { buttonStyles } from '../Button'
import { MenuPanel } from './MenuPanel'

const panelVariants: Variants = {
  open: {
    opacity: 1,
    scale: 1,
  },
  closed: {
    opacity: 0,
    scale: 0.95,
  },
}

const buttonVariants: Variants = {
  open: {
    x: '-20%',
    y: '45%',
  },
  closed: {
    x: 0,
    y: 0,
  },
}

export function Menu() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  return (
    <MotionConfig transition={transitions.punchy}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <div className="relative flex">
          <PopoverPrimitive.Trigger asChild>
            <motion.button
              variants={buttonVariants}
              initial="closed"
              animate={open ? 'open' : 'closed'}
              style={{
                border: 'none',
                background: 'none',
                boxShadow: 'none',
              }}
              className={buttonStyles({
                className: 'flex items-center gap-3 z-10',
                motionSafe: false,
              })}
            >
              <MenuIcon />
              {open ? 'Close' : 'Menu'}
            </motion.button>
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Anchor asChild>
            <div
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ref={containerRef as any}
              id="portal-container"
              className={buttonStyles({
                className: 'absolute inset-0',
                translucent: true,
              })}
            />
          </PopoverPrimitive.Anchor>
        </div>

        <AnimatePresence>
          {open && (
            <PopoverPrimitive.Portal
              container={containerRef.current}
              key="portal"
              forceMount
            >
              <PopoverPrimitive.Content
                align="end"
                alignOffset={-1}
                sideOffset={-40}
                asChild
              >
                <motion.div
                  variants={panelVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  style={{
                    transformOrigin:
                      'var(--radix-popover-content-transform-origin)',
                  }}
                  className={contentStyles({ translucent: true })}
                >
                  <MenuPanel />
                </motion.div>
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          )}
        </AnimatePresence>
      </PopoverPrimitive.Root>
    </MotionConfig>
  )
}

function getLineMotionProps(direction: -1 | 1) {
  return {
    variants: {
      open: {
        y: 4 * direction,
        rotate: 45 * direction,
      },
      closed: {
        y: 0,
        rotate: 0,
      },
    },
  }
}

function MenuIcon() {
  const [topLineMotionProps, bottomLineMotionProps] = useMemo(() => {
    return [getLineMotionProps(1), getLineMotionProps(-1)]
  }, [])

  return (
    <svg viewBox="0 0 24 24" className="w-[1em] h-[1em] stroke-gray10">
      <motion.path
        d="M1 8H23"
        strokeWidth="2"
        strokeLinecap="round"
        {...topLineMotionProps}
      />
      <motion.path
        d="M1 16H23"
        strokeWidth="2"
        strokeLinecap="round"
        {...bottomLineMotionProps}
      />
    </svg>
  )
}

const contentStyles = cva(
  [
    'max-h-[80vh] p-8 pb-0 overflow-hidden',
    'bg-gray1 border border-gray7 dark:border-gray6 shadow-sm rounded-lg',
    styles.menuContent,
  ],
  {
    variants: {
      translucent: {
        true: [
          'dark:bg-grayA3',
          // 'dark:backdrop-blur-md dark:backdrop-brightness-75 dark:saturate-200 dark:contrast-75',
          'dark:backdrop-blur-md dark:backdrop-brightness-75',
        ],
        false: ['dark:bg-gray3'],
      },
    },
    defaultVariants: {
      translucent: false,
    },
  }
)
