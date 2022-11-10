import { cva } from 'cva'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { ReactComponent as Twitter } from '@/icons/twitter.svg'
import { ReactComponent as GitHub } from '@/icons/github.svg'
import { ReactComponent as Logo } from '@/icons/logo.svg'
import { toggleTheme } from '@/lib/theme-toggle'
import { isBrowser } from '@/lib/general'

import ContactDialog from '../Contact/ContactDialog'
import { buttonStyles } from '../Button'

const contentStyles = cva([
  'w-screen max-w-[325px] max-h-[80vh] p-8 pb-0',
  'bg-gray1 dark:bg-gray3 border border-gray7 dark:border-gray6 shadow-sm rounded-lg',
  'backdrop-blur-md dark:backdrop-brightness-75',
  // 'dark:backdrop-blur-md dark:backdrop-brightness-75 dark:saturate-200 dark:contrast-75',
  // 'data-[state=open]:motion-safe:animate-showContent data-[state=closed]:motion-safe:animate-hideContent',
])

const menuItemStyles = cva(['grid grid-cols-[1.25rem_1fr] items-center gap-2'])
const bulletStyles = cva(['w-2 h-2 rounded-full justify-self-center'])

export function Menu() {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        className={buttonStyles({ className: 'flex items-center gap-3' })}
      >
        <svg viewBox="0 0 24 24" className="w-[1em] h-[1em] stroke-gray10">
          <path d="M1 8H23" strokeWidth="2" strokeLinecap="round"></path>
          <path d="M1 16H23" strokeWidth="2" strokeLinecap="round"></path>
        </svg>
        Menu
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={contentStyles({ className: 'flex flex-col gap-8' })}
          align="end"
          alignOffset={-1}
          sideOffset={-40}
        >
          <Nav />

          <div>
            <h4 className="text-sm text-gray10 mb-4">Connect</h4>
            <div className="flex flex-col">
              <a
                href="https://twitter.com/orlantquijada"
                className={menuItemStyles({ className: 'text-sm' })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </a>
              <a
                href="https://github.com/orlantquijada"
                className={menuItemStyles({ className: 'text-sm' })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHub className="w-5 h-5" />
                GitHub
              </a>
            </div>
          </div>

          <button
            className={menuItemStyles({ className: 'text-sm text-left' })}
            onClick={() => {
              if (isBrowser) toggleTheme()
            }}
          >
            <Logo className="w-5 h-5" />
            Toggle Theme
          </button>

          <SendButton />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
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
            <a
              href={link.href}
              className={menuItemStyles({
                className: 'font-medium',
              })}
            >
              <span className={bulletStyles({ className: link.color })}></span>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function SendButton() {
  return (
    <ContactDialog>
      <button
        className={menuItemStyles({
          className: '-mx-8 py-6 px-8 text-left border-t border-gray7',
        })}
      >
        <span className={bulletStyles({ className: 'bg-accent' })} />
        Send me a message
      </button>
    </ContactDialog>
  )
}
