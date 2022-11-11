import { ComponentProps, ReactNode, useState } from 'react'

// import { ReactComponens as Send send } from '@/icons/send.svg'
import { ReactComponent as Send } from '@/icons/send.svg'
import { ReactComponent as Copy } from '@/icons/copy.svg'
import { ReactComponent as Check } from '@/icons/check.svg'
import { ReactComponent as GitHub } from '@/icons/github.svg'
import { ReactComponent as Twitter } from '@/icons/twitter.svg'

import ContactDetail from './ContactDetail'
import { Button, buttonStyles } from '../Button'
import * as Dialog from '../Dialog'

import styles from './ContactDialog.module.css'

const email = 'orlanq@pm.me'

export default function ContactDialog({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Dialog.Root trigger={children}>
      <div className="flex flex-col gap-6 md:gap-8">
        <Dialog.Title className="text-xl md:text-2xl font-medium">
          Contact
        </Dialog.Title>

        <div className="flex flex-col gap-8 text-sm md:text-base">
          <ContactDetail title="Email" description={email}>
            <div className="flex gap-2">
              <a
                href={`mailto:${email}`}
                className={buttonStyles({
                  className: 'flex items-center gap-2 active:scale-95',
                  translucent: true,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className={styles.icon} />
                Compose
              </a>
              <Button
                className="flex items-center gap-2 active:scale-95"
                onClick={copyEmail}
                translucent
              >
                {!copied ? (
                  <Copy className={styles.icon} />
                ) : (
                  <Check className={styles.icon} />
                )}
                Copy
              </Button>
            </div>
          </ContactDetail>

          <div className="w-full h-auto border border-gray6" />

          <ContactDetail
            title="Stay in touch"
            description="I'm more active on twitter"
          >
            <div className="flex gap-4">
              <StyledA href="https://github.com/orlantquijada">
                <GitHub className="fill-current text-gray11 h-6 w-6 grid place-items-center" />
                GitHub
              </StyledA>
              <StyledA href="https://twitter.com/orlantquijada">
                <Twitter className="fill-current text-gray11 h-6 w-6 grid place-items-center" />
                Twitter
              </StyledA>
            </div>
          </ContactDetail>
        </div>
      </div>
    </Dialog.Root>
  )
}

function StyledA(props: ComponentProps<'a'>) {
  const { href } = props
  return (
    <a
      {...props}
      className="hover:bg-grayA3 p-1 pr-2 rounded-full transition-colors flex items-center gap-1 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray7"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    />
  )
}
