import { cn } from '@/lib/general'
import {
  useState,
  type ComponentProps,
  useRef,
  type ReactNode,
  type ElementRef,
} from 'react'

type Props = {
  src: string
  type?: ComponentProps<'source'>['type']
  pausedIcon: ReactNode
  playingIcon: ReactNode
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

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        loop
        onLoad={(e) => {
          setState(e.currentTarget.paused ? 'paused' : 'playing')
        }}
      >
        <source src={src} type={type} />
      </video>

      <button
        className={cn(
          'absolute bottom-4 right-4 grid aspect-square h-10 translate-y-10 place-items-center rounded-full bg-grayA2 text-gray11 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray12 dark:text-gray9',
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
