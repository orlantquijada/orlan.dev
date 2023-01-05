import { styled } from '@stitches.config'
import { ReactNode, useRef } from 'react'

const DELAY = 300

export default function LikeWrapper({ children }: { children: ReactNode }) {
  const timer = useRef<NodeJS.Timer | null>(null)

  return (
    <Container
      onClick={(_) => {
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = null

          // do something
          // console.log('double tapped')
          // console.log({ y: e.clientY, x: e.clientX })
        } else {
          timer.current = setTimeout(() => {
            timer.current = null
          }, DELAY)
        }
      }}
    >
      {children}
    </Container>
  )
}

const Container = styled('div', {
  // position: 'absolute',
  // inset: 0,
})
