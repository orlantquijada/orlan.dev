import { LayoutGroup } from 'framer-motion'
import { useStore } from '@nanostores/react'

import styles from './styles.module.css'
import { selectedTags } from '@/stores/notes'
import { MotionNoteCard, type MotionNoteCardProps } from '../NoteCard/NoteCard'

type Note = Omit<MotionNoteCardProps, 'isSelecting'>

export default function NotesList() {
  const _selectedTags = useStore(selectedTags)

  const isSelecting = Boolean(_selectedTags.length)

  const filtered: Note[] = []
  const rest: Note[] = []
  for (const note of list) {
    if (
      isSelecting &&
      _selectedTags.every((selectedTag) => note.tags.includes(selectedTag))
    )
      filtered.push({ ...note, selected: true })
    else rest.push({ ...note, selected: false })
  }

  return (
    <div className={styles.notesList}>
      <LayoutGroup>
        {filtered.map((note) => (
          <MotionNoteCard
            {...note}
            key={`${note.title}1`}
            isSelecting={isSelecting}
          />
        ))}
        {rest.map((note) => (
          <MotionNoteCard
            {...note}
            key={`${note.title}2`}
            isSelecting={isSelecting}
          />
        ))}
      </LayoutGroup>
    </div>
  )
}

const list = [
  {
    href: '/',
    title: 'Design tokens',
    description:
      'The most atomic design decisions that make up a larger design system.',
    tags: ['design', 'css'],
  },

  {
    href: '/',
    title: 'React hooks',
    description: 'Handy utilities for React projects.',
    tags: ['react'],
  },

  {
    href: '/',
    title: 'CSS Variables',
    tags: ['css'],
  },

  {
    href: '/',
    title: 'The command line',
    description: 'Useful snippets for working in your terminal.',
    tags: ['linux'],
  },

  {
    href: '/',
    title: 'Typography',
    description: 'Shapes and forms.',
    tags: ['design'],
  },
  {
    href: '/',
    title: 'Quotes',
    description:
      'A collection of passages that have stuck with me, and that I like to come back to when I need some inspiration.',
    tags: ['misc'],
  },
  {
    href: '/',
    title: 'CSS Resets',
    tags: ['css'],
  },
]
