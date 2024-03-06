import { useState } from 'react'

type Props = { char: string }

export default function Unicode({ char }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(char)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <button
      onClick={copy}
      className="flex aspect-square h-24 items-center justify-center rounded-2xl bg-[hsla(0,0%,99%,0.4)] shadow-surface-elevation-low transition duration-300 hover:bg-[hsla(0,0%,99%,0.6)] hover:shadow-surface-elevation-medium dark:border-grayA3 dark:bg-grayA3 dark:hover:bg-grayA4"
    >
      <span className="text-6xl font-bold text-gray11 opacity-50">
        {copied ? '✓' : char}
      </span>
    </button>
  )
}
