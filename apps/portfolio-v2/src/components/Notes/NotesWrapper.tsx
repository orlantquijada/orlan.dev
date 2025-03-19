import type { CollectionEntry } from 'astro:content'
import type { TagGraphMap } from '@/lib/notes'
import NoteTagsList from './NoteTagsList'
import NotesList from './NotesList'

type Props = {
  tags: string[]
  tagsGraph: TagGraphMap
  notes: Array<CollectionEntry<'notes'>['data'] & { href: string }>
}

// wrapper component necessary for layout animations
export default function NotesWrapper({ notes, tags, tagsGraph }: Props) {
  return (
    <>
      <NoteTagsList tags={tags} tagsGraph={tagsGraph} />
      <NotesList notes={notes} className="mt-14" />
    </>
  )
}
