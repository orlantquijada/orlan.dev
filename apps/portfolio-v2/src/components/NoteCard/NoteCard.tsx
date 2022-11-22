import { motion } from 'framer-motion'
import { noteCardStyles } from './styles'
import type { NoteFrontmatter } from '@/lib/notes'

export type NoteCardProps = NoteFrontmatter & {
  href: string
}

export default function NoteCard(props: NoteCardProps) {
  const { title, description, href } = props

  return (
    <a href={href} className={noteCardStyles()}>
      <h3 className="font-medium">{title}</h3>
      {description ? (
        <p className="text-sm text-gray10 dark:text-gray11">{description}</p>
      ) : null}
    </a>
  )
}

export type MotionNoteCardProps = NoteCardProps & {
  selected: boolean
  isSelecting: boolean
}

// ! temp solution cause i dont want a motion component wrapper div
// e.g. <motion.div><NoteCard/></motion.div>
export function MotionNoteCard(props: MotionNoteCardProps) {
  const { title, description, href, selected, isSelecting } = props

  return (
    <motion.a
      layoutId={title}
      animate={isSelecting ? { opacity: !selected ? 0.3 : 1 } : {}}
      href={href}
      className={noteCardStyles()}
    >
      <h2 className="font-medium">{title}</h2>
      {description ? (
        <p className="text-sm text-gray10 dark:text-gray11">{description}</p>
      ) : null}
    </motion.a>
  )
}
