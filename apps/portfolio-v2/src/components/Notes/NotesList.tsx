import { useStore } from '@nanostores/react'
import { cx } from 'cva'
import { LayoutGroup } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import type { NoteFrontmatter } from '@/lib/notes'
import { selectedTags } from '@/stores/notes'

import { MotionNoteCard } from '../NoteCard/NoteCard'
import styles from './styles.module.css'

type Note = NoteFrontmatter & { selected: boolean; href: string }
type Props = { notes: Omit<Note, 'selected'>[]; className?: string }

// estimated height per note
const HEIGHT = 100
const CARD_MARGIN_BOTTOM = 12

const toRem = (num: number) => `${num / 16}rem`

export default function NotesList(props: Props) {
  const { notes, className } = props
  const _selectedTags = useStore(selectedTags)

  const isSelecting = Boolean(_selectedTags.length)

  const filtered: Note[] = []
  const rest: Note[] = []
  for (const note of notes) {
    if (
      isSelecting &&
      _selectedTags.every((selectedTag) => note.tags.has(selectedTag))
    )
      filtered.push({ ...note, selected: true })
    else rest.push({ ...note, selected: false })
  }

  // fixed height is needed (relative height will cause for the container to assume 100% height for its height)
  const smHeight = toRem(
    Math.ceil(notes.length / 2) * (HEIGHT + CARD_MARGIN_BOTTOM),
  )
  const mdHeight = toRem(
    Math.ceil(notes.length / 3) * (HEIGHT + CARD_MARGIN_BOTTOM),
  )

  return (
    <div
      style={
        {
          '--smHeight': smHeight,
          '--mdHeight': mdHeight,
          '--mason-mb': toRem(CARD_MARGIN_BOTTOM),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
      className={twMerge(
        cx(className, styles.notesList, [
          'h-full sm:h-[var(--smHeight)] md:h-[var(--mdHeight)]',
        ]),
      )}
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
