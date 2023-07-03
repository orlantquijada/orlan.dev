import { motion } from 'framer-motion'
import Image from 'next/image'
import { PropsWithChildren, useState } from 'react'

import { useDoubleClick } from '@/hooks/useDoubleClick'
import { like } from '@/lib/like'
import { styled } from '@stitches.config'
import { Daily } from 'contentlayer/generated'

import Heart from '../../public/heart.png'

const HEART_SIZE = 130
const SKEW_DEG = 30

type Props = PropsWithChildren<{
  onLike?: () => void
}> &
  Pick<Daily, 'month' | 'day'>

export default function LikeWrapper({ children, month, day, onLike }: Props) {
  const [open, setOpen] = useState<
    false | { y: number; x: number; rotate: number; key: number }
  >(false)

  const handler = useDoubleClick(
    (e) => {
      setOpen({
        x: e.pageX,
        y: e.pageY,
        rotate: 0,
        key: new Date().getTime(),
      })
      like({ month, day })
      onLike?.()
    },
    { delay: 300 }
  )

  return (
    <Container
      onClick={handler}
      /* onClick={(e) => { */
      /*   if (timer.current) { */
      /*     clearTimeout(timer.current) */
      /*     timer.current = null */
      /**/
      /*     // do something */
      /*     setOpen({ */
      /*       x: e.pageX, */
      /*       y: e.pageY, */
      /*       rotate: 0, */
      /*       key: new Date().getTime(), */
      /*     }) */
      /*     like({ month, day }) */
      /*     onLike?.() */
      /*   } else { */
      /*     timer.current = setTimeout(() => { */
      /*       timer.current = null */
      /*     }, DELAY) */
      /*   } */
      /* }} */
    >
      {children}

      {open ? (
        <Box
          initial={{
            y: '-50%',
            x: '-50%',
            top: open.y,
            left: open.x,
            position: 'absolute',
            rotate: `${getRandomInt(-SKEW_DEG, SKEW_DEG)}deg`,
          }}
          css={{ width: HEART_SIZE, height: HEART_SIZE, userSelect: 'none' }}
          animate={{
            scale: [1, 0.85, 1, 1, 1.3],
            y: -120,
            opacity: 0,
          }}
          transition={{
            scale: { delay: 0, times: [0, 0.15, 0.3, 0.5, 1] },
            delay: 0.5,
          }}
          onAnimationComplete={() => setOpen(false)}
          key={open.key}
        >
          <Image
            src={Heart}
            alt="Heart"
            objectFit="fill"
            width={HEART_SIZE}
            height={HEART_SIZE}
          />
        </Box>
      ) : null}
    </Container>
  )
}

const Container = styled('div', {
  position: 'relative',
  overflow: 'clip',
  maxWidth: '100vw',
})

const Box = styled(motion.div, {})

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
