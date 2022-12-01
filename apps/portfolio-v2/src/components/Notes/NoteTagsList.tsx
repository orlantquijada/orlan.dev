import { type ComponentProps, forwardRef } from 'react'
import { useStore } from '@nanostores/react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ReactComponent as Close } from '@/icons/cross.svg'

import Chip from '../Chip/Chip'
import { addTag, clearTags, removeTag, selectedTags } from '@/stores/notes'
import type { TagMap } from '@/lib/notes'

import styles from './styles.module.css'

const variants: Variants = {
  fadeOut: {
    opacity: 0,
  },
  slideIn: {
    x: -4,
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
    <div className="flex flex-wrap gap-2 mt-6 sm:max-w-[85%] justify-start">
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

        {_selectedTags.map((tag, index) =>
          index === 0 ? (
            <Tag
              tag={tag}
              variants={variants}
              layoutId={tag}
              key={tag}
              style={{ zIndex: 5 - index }}
            />
          ) : (
            <Tag
              tag={tag}
              layoutId={tag}
              variants={variants}
              animate="slideIn"
              key={tag}
              style={{
                backgroundColor: 'var(--gray11)',
                borderColor: 'var(--gray12)',
                zIndex: 5 - index,

                paddingLeft: 36,
                marginLeft: -32,
                justifyContent: 'flex-end',
              }}
            />
          )
        )}

        {!isSelecting
          ? tags.map((tag) => (
              <Tag
                tag={tag}
                initial={{ opacity: 1 }}
                layoutId={tag}
                key={tag}
                variants={variants}
                exit="fadeOut"
              />
            ))
          : visibleTags.map((tag) => (
              <Tag tag={tag} variants={variants} layoutId={tag} key={tag} />
            ))}
      </AnimatePresence>
    </div>
  )
}

const Tag = forwardRef<
  HTMLButtonElement,
  { tag: string } & ComponentProps<typeof motion.button>
>((props, ref) => {
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
        style={{
          borderRadius: 999,
          ...rest.style,
        }}
        ref={ref}
        onClick={() => {
          if (isSelected) removeTag(tag)
          else addTag(tag)
        }}
      >
        <motion.span layout>{tag}</motion.span>
      </motion.button>
    </Chip>
  )
})
