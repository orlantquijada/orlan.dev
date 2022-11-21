import Chip from './Chip/Chip'
import { addTag, removeTag, selectedTags } from '@/stores/notes'
import { useStore } from '@nanostores/react'

type Props = {
  tags: string[]
}

export default function NoteTagsList(props: Props) {
  const { tags } = props

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:max-w-[85%] justify-start">
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  )
}

function Tag({ tag }: { tag: string }) {
  const _selectedTags = useStore(selectedTags)
  const isSelected = _selectedTags.includes(tag)

  return (
    <Chip
      key={tag}
      color={isSelected || tag === 'all' ? 'primary' : 'gray'}
      asChild
    >
      <button
        onClick={() => {
          if (isSelected) removeTag(tag)
          else addTag(tag)
        }}
      >
        {tag}
      </button>
    </Chip>
  )
}
