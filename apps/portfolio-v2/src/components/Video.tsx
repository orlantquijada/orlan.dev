import type { HTMLAttributes } from 'astro/types'
import {
  useState,
  useRef,
  type ReactNode,
  type ElementRef,
  useEffect,
} from 'react'
import { browserIconButtonStyles } from './BrowserIconButton/styles'
import { cn } from '@/lib/general'

type Props = {
  src: string
  type?: Exclude<HTMLAttributes<'source'>['type'], null>
  pausedIcon?: ReactNode
  playingIcon?: ReactNode
  children?: ReactNode
}

export default function Video({
  src,
  type = 'video/mp4',
  pausedIcon,
  playingIcon,
}: Props) {
  const videoRef = useRef<ElementRef<'video'>>(null)
  const [state, setState] = useState<'playing' | 'paused'>()

  useEffect(() => {
    if (videoRef.current) {
      setState(videoRef.current.paused ? 'paused' : 'playing')
    }
  }, [])

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        loop
        controls={false}
        onPause={() => {
          setState('paused')
        }}
        onPlay={() => {
          setState('playing')
        }}
      >
        <source src={src} type={type} />
      </video>

      <button
        className={cn(
          browserIconButtonStyles(),
          'absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
          state === 'paused' && 'translate-y-0 opacity-100',
        )}
        onClick={() => {
          if (!videoRef.current) return

          if (videoRef.current.paused) {
            videoRef.current.play()
            setState('playing')
          } else {
            videoRef.current.pause()
            setState('paused')
          }
        }}
      >
        {state === 'paused' ? playingIcon : pausedIcon}
      </button>
    </div>
  )
}
