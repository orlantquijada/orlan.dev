import { styled } from '@stitches.config'
import { ReactNode, useRef, useState } from 'react'
import Image from 'next/image'
import Heart from '../../public/heart.png'
// import Heart from '../../public/heart.svg'
import { motion } from 'framer-motion'
import { likeDaily } from '@/lib/like'
import { Daily } from 'contentlayer/generated'

const DELAY = 300
const HEART_SIZE = 130
const SKEW_DEG = 30

export default function LikeWrapper({
  children,
  month,
  day,
}: { children: ReactNode } & Pick<Daily, 'month' | 'day'>) {
  const timer = useRef<NodeJS.Timer | null>(null)

  const [open, setOpen] = useState<
    false | { y: number; x: number; rotate: number; key: number }
  >(false)

  return (
    <Container
      onClick={(e) => {
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = null

          // do something
          setOpen({
            x: e.pageX,
            y: e.pageY,
            rotate: 0,
            key: new Date().getTime(),
          })
          likeDaily({ month, day })
        } else {
          timer.current = setTimeout(() => {
            timer.current = null
          }, DELAY)
        }
      }}
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
          css={{ width: HEART_SIZE, height: HEART_SIZE }}
          animate={{
            scale: [1, 0.85, 1],
            y: -120,
            // opacity: 0.2,
            opacity: 0,
          }}
          transition={{ scale: { duration: 0.2, delay: 0 }, delay: 0.3 }}
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
