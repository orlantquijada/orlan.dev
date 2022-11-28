import { LayoutGroup } from 'framer-motion'
import { useStore } from '@nanostores/react'
import { cx } from 'cva'

import { selectedTags } from '@/stores/notes'
import type { NoteFrontmatter } from '@/lib/notes'
import { MotionNoteCard } from '../NoteCard/NoteCard'
import styles from './styles.module.css'

type Note = NoteFrontmatter & { selected: boolean; href: string }
type Props = { notes: Omit<Note, 'selected'>[]; className?: string }

// estimated height per note
const HEIGHT = 100

export default function NotesList(props: Props) {
  const { notes, className } = props
  const _selectedTags = useStore(selectedTags)

  const isSelecting = Boolean(_selectedTags.length)

  const filtered: Note[] = []
  const rest: Note[] = []
  for (const note of notes) {
    if (
      isSelecting &&
      _selectedTags.every((selectedTag) => note.tags.includes(selectedTag))
    )
      filtered.push({ ...note, selected: true })
    else rest.push({ ...note, selected: false })
  }

  // fixed height is needed (relative height will cause for the container to assume 100% height for its height)
  const smHeight = `${Math.ceil(notes.length / 2) * HEIGHT}px`
  const mdHeight = `${Math.ceil(notes.length / 3) * HEIGHT}px`

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ '--smHeight': smHeight, '--mdHeight': mdHeight } as any}
      className={cx(className, styles.notesList, [
        'h-full sm:h-[var(--smHeight)] md:h-[var(--mdHeight)]',
      ])}
    >
      <LayoutGroup>
        {filtered.map((note) => (
          <MotionNoteCard
            {...note}
            key={note.title}
            isSelecting={isSelecting}
          />
        ))}
        {rest.map((note) => (
          <MotionNoteCard
            {...note}
            key={note.title}
            isSelecting={isSelecting}
          />
        ))}
      </LayoutGroup>
    </div>
  )
}
