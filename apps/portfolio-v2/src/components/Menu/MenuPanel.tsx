import type { ReactNode } from 'react'
import { cva } from 'cva'

import { ReactComponent as Twitter } from '@/icons/twitter.svg'
import { ReactComponent as GitHub } from '@/icons/github.svg'
import { ReactComponent as Logo } from '@/icons/logo.svg'
import { ReactComponent as ArrowTopRight } from '@/icons/arrow-top-right.svg'
import { ReactComponent as ArrowRight } from '@/icons/arrow-right.svg'

import { toggleTheme } from '@/lib/theme-toggle'
import { isBrowser } from '@/lib/general'

import ContactDialog from '../Contact/ContactDialog'

import styles from './styles.module.css'

export function MenuPanel() {
  return (
    <div className="flex flex-col gap-8 mt-10">
      <Nav />

      <div>
        <h4 className="text-gray10 mb-3">Connect</h4>
        <div className="flex flex-col">
          <ConnectLink
            Icon={<Twitter className="w-5 h-5" />}
            label="Twitter"
            href="https://twitter.com/orlantquijada"
          />
          <ConnectLink
            Icon={<GitHub className="w-5 h-5" />}
            label="GitHub"
            href="https://github.com/orlantquijada"
          />
        </div>
      </div>

      <button
        className={menuItemStyles({
          className: 'text-sm text-left transition-all hover:translate-x-1',
        })}
        onClick={() => {
          if (isBrowser) toggleTheme()
        }}
      >
        <div className="flex justify-center">
          <Logo className="w-4 h-4" />
        </div>
        Toggle Theme
      </button>

      <SendButton />
    </div>
  )
}

function SendButton() {
  return (
    <ContactDialog>
      <button
        className={menuItemStyles({
          className:
            '-mx-8 px-8 text-left border-t border-gray7 transition-colors hover:bg-grayA3',
          intent: 'sendBtn',
        })}
      >
        <span className={bulletStyles({ className: 'bg-accent' })} />
        Send me a message
      </button>
    </ContactDialog>
  )
}

function MenuItem(props: { Icon: ReactNode; children: ReactNode }) {
  const { Icon, children } = props

  return (
    <div
      className={menuItemStyles({
        className: 'group transition-transform hover:translate-x-1',
      })}
    >
      {children}
      <div className="transition-all opacity-0 -mx-2 group-hover:translate-x-1 group-hover:opacity-100">
        {Icon}
      </div>
    </div>
  )
}

function ConnectLink(props: { href: string; label: string; Icon: ReactNode }) {
  const { href, label, Icon } = props

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <MenuItem Icon={<ArrowTopRight className={`${styles.icon} w-4 h-4`} />}>
        {Icon}
        {label}
      </MenuItem>
    </a>
  )
}

const links: Array<{
  href: string
  label: string
  color: `bg-accent-${'blue' | 'pink' | 'violet'}`
}> = [
  { href: '/writing', label: 'Writing', color: 'bg-accent-pink' },
  { href: '/bookmarks', label: 'Bookmarks', color: 'bg-accent-violet' },
  { href: '/tools', label: 'Tools', color: 'bg-accent-blue' },
]

function Nav() {
  return (
    <nav>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="font-medium">
              <MenuItem
                Icon={
                  <ArrowRight
                    className={`text-gray10 w-4 h-4 ${styles.icon}`}
                  />
                }
              >
                <span
                  className={bulletStyles({ className: link.color })}
                ></span>
                {link.label}
              </MenuItem>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const menuItemStyles = cva(
  ['grid grid-cols-[1.25rem_auto_1fr] items-center gap-2'],
  {
    variants: {
      intent: {
        default: 'py-1',
        sendBtn: 'py-6',
      },
    },
    defaultVariants: {
      intent: 'default',
    },
  }
)
const bulletStyles = cva(['w-2 h-2 rounded-full justify-self-center'])