import { type ComponentProps, type ReactNode, useState } from 'react'
import { cva } from 'cva'

import { ReactComponent as Send } from '@/icons/send-filled.svg'
import { ReactComponent as Copy } from '@/icons/copy-filled.svg'
import { ReactComponent as Check } from '@/icons/check.svg'
import { ReactComponent as GitHub } from '@/icons/github.svg'
import { ReactComponent as Twitter } from '@/icons/twitter.svg'

import ContactDetail from './ContactDetail'
import { Button, buttonStyles } from '../Button'
import * as Dialog from '../Dialog'

import styles from './ContactDialog.module.css'
import { EMAIL } from '@/utils/constants'

export default function ContactDialog({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false)

  // NOTE: does not work on mobile & localhost (permission problem)
  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Dialog.Root trigger={children}>
      <div className="flex flex-col gap-6 md:gap-8">
        <Dialog.Title className="text-xl font-medium md:text-2xl">
          Contact
        </Dialog.Title>

        <div className="flex flex-col gap-8 text-sm md:text-base">
          <ContactDetail title="Email" description={EMAIL}>
            <div className="flex gap-2">
              <a
                href={`mailto:${EMAIL}`}
                className={buttonStyles({
                  className: 'flex items-center gap-2 active:scale-95',
                  translucent: true,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className={iconStyles()} />
                Compose
              </a>
              <Button
                className="flex items-center gap-2 active:scale-95"
                onClick={copyEmail}
                translucent
              >
                {!copied ? (
                  <Copy className={iconStyles()} />
                ) : (
                  <Check className={iconStyles()} />
                )}
                Copy
              </Button>
            </div>
          </ContactDetail>

          <div className="h-auto w-full border border-gray6" />

          <ContactDetail
            title="Stay in touch"
            description="I'm more active on twitter"
          >
            <div className="flex gap-4">
              <Social href="https://github.com/orlantquijada">
                <GitHub className={iconStyles({ size: 'md' })} />
                GitHub
              </Social>
              <Social href="https://twitter.com/orlantquijada">
                <Twitter className={iconStyles({ size: 'md' })} />
                Twitter
              </Social>
            </div>
          </ContactDetail>
        </div>
      </div>
    </Dialog.Root>
  )
}

function Social(props: ComponentProps<'a'>) {
  return (
    <a
      {...props}
      className="flex items-center gap-1 rounded-full p-1 pr-2 outline-offset-2 transition-colors hover:bg-grayA3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray7"
      target="_blank"
      rel="noopener noreferrer"
    />
  )
}

const iconStyles = cva([styles.icon], {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
