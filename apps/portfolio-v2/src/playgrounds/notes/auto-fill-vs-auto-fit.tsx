import { useRef, useState, type ComponentProps } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

import { Button } from '@/components/Button'

import { ReactComponent as Reset } from '@/icons/reset.svg'

type Auto = 'fit' | 'fill'

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null)
  const [auto, setAuto] = useState<Auto>('fill')

  const handleChangeAuto = (value: Auto) => {
    if (auto) setAuto(value)
  }
  const handleResetShowcase = () => {
    if (!ref.current) return

    ref.current.style.width = 'initial'
    ref.current.style.height = 'initial'
  }

  return (
    <div className="flex flex-col">
      <div
        ref={ref}
        className="relative flex max-w-full resize flex-col justify-between gap-4 overflow-auto rounded-xl border border-dashed border-grayA9 bg-grayA4 p-2"
      >
        <div
          className="grid gap-2"
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore inline css variable
            '--sizing': `auto-${auto}`,
            gridTemplateColumns: 'repeat(var(--sizing), minmax(10rem,1fr))',
          }}
        >
          <Card />
          <Card />
        </div>

        <div className="flex justify-end gap-4">
          <AutoFitFillToggle onChangeAuto={handleChangeAuto} auto={auto} />

          <Button
            translucent
            className="grid aspect-square h-8 place-items-center p-0 text-grayA11"
            onClick={handleResetShowcase}
          >
            <Reset />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Card() {
  return (
    <div className="flex h-48 flex-col rounded-lg bg-gray5 p-1">
      <div className="h-4/5 w-full rounded-md bg-gray7"></div>
      <p className="flex flex-grow items-center text-gray11">lorem ipsum</p>
    </div>
  )
}

function AutoFitFillToggle({
  auto,
  onChangeAuto,
}: {
  auto: Auto
  onChangeAuto: (value: Auto) => void
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={auto}
      onValueChange={onChangeAuto}
      className="flex w-fit overflow-hidden rounded-md"
    >
      <ToggleGroup.Item value="fill" asChild>
        <ToggleButton>auto-fill</ToggleButton>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="fit" asChild>
        <ToggleButton>auto-fit</ToggleButton>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}

function ToggleButton({ children, ...props }: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className="flex h-8 items-center rounded-md border border-transparent px-3 text-grayA11 first:rounded-l-md last:rounded-r-md data-[state=on]:border-grayA5 data-[state=on]:bg-grayA5 data-[state=on]:font-bold data-[state=on]:italic data-[state=on]:text-grayA12"
    >
      <code className="text-sm leading-none">{children}</code>
    </button>
  )
}
