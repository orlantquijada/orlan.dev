import type { ComponentProps } from 'react'
import { useStore } from '@nanostores/react'
import { AnimatePresence, LayoutGroup, motion, Variants } from 'framer-motion'
import { ReactComponent as Close } from '@/icons/cross.svg'

import Chip from '../Chip/Chip'
import { addTag, clearTags, removeTag, selectedTags } from '@/stores/notes'
import type { TagMap } from '@/lib/notes'

import styles from './styles.module.css'

const variants: Variants = {
  fadeOut: {
    opacity: 0,
  },
}

type Props = {
  tags: string[]
  tagsGraph: TagMap
}

export default function NoteTagsList(props: Props) {
  const { tags, tagsGraph } = props
  const _selectedTags = useStore(selectedTags)
  const isSelecting = Boolean(_selectedTags.length)

  const visibleTags = [
    ...new Set(_selectedTags.flatMap((tag) => [...(tagsGraph.get(tag) || '')])),
  ].filter((tag) => !_selectedTags.includes(tag))

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:max-w-[85%] justify-start">
      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {isSelecting ? (
            <Chip asChild>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => clearTags()}
              >
                <Close className={styles.icon} />
              </motion.button>
            </Chip>
          ) : (
            <Chip color="primary" asChild>
              <motion.span variants={variants} exit="fadeOut">
                all
              </motion.span>
            </Chip>
          )}

          {_selectedTags.map((tag) => (
            <motion.span layoutId={tag} key={tag + 2}>
              <Tag tag={tag} />
            </motion.span>
          ))}

          {!isSelecting
            ? tags.map((tag) => (
                <motion.span
                  layoutId={tag}
                  key={tag}
                  variants={variants}
                  initial={{ opacity: 1 }}
                  exit="fadeOut"
                >
                  <Tag tag={tag} initial={{ opacity: 1 }} />
                </motion.span>
              ))
            : visibleTags.map((tag) => (
                <motion.span layoutId={tag} key={tag + 1}>
                  <Tag tag={tag} />
                </motion.span>
              ))}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}

function Tag(props: { tag: string } & ComponentProps<typeof motion.button>) {
  const { tag, ...rest } = props
  const _selectedTags = useStore(selectedTags)
  const isSelected = _selectedTags.includes(tag)

  return (
    <Chip
      key={tag}
      color={isSelected || tag === 'all' ? 'primary' : 'gray'}
      asChild
    >
      <motion.button
        {...rest}
        onClick={(e) => {
          if (isSelected) removeTag(tag)
          else addTag(tag)

          if (rest.onClick) rest.onClick(e)
        }}
      >
        {tag}
      </motion.button>
    </Chip>
  )
}
