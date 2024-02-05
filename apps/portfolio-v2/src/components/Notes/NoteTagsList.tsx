import { type ComponentProps, forwardRef, useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ReactComponent as Close } from '@/icons/cross.svg'

import Chip from '../Chip/Chip'
import { addTag, clearTags, removeTag, selectedTags } from '@/stores/notes'
import { getNeighborhoodsIntersection, type TagGraphMap } from '@/lib/notes'

import styles from './styles.module.css'

const variants: Variants = {
  fadeOut: {
    opacity: 0,
  },
  slideIn: (custom) => ({
    x: -4 * custom,
  }),
}

type Props = {
  tags: string[]
  tagsGraph: TagGraphMap
}

export default function NoteTagsList(props: Props) {
  const { tags, tagsGraph } = props
  const _selectedTags = useStore(selectedTags)
  const isSelecting = Boolean(_selectedTags.length)

  const visibleTags = getNeighborhoodsIntersection(tagsGraph, _selectedTags)

  const initialOpacity = useTagsInitialOpacity()

  return (
    <div className="mt-6 flex flex-wrap justify-start gap-2 sm:max-w-[85%] md:gap-y-3">
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
              custom={index}
              layoutId={tag}
              variants={variants}
              animate="slideIn"
              key={tag}
              style={{
                zIndex: 5 - index,

                paddingLeft: 36,
                marginLeft: -32,
                justifyContent: 'flex-end',
              }}
            />
          ),
        )}

        {!isSelecting
          ? tags.map((tag) => (
              <Tag
                tag={tag}
                initial={{ opacity: initialOpacity }}
                animate={{ opacity: 1 }}
                layoutId={tag}
                key={tag}
                variants={variants}
                exit="fadeOut"
              />
            ))
          : visibleTags.map((tag) => (
              <Tag
                tag={tag}
                initial={{ opacity: initialOpacity }}
                animate={{ opacity: 1 }}
                variants={variants}
                layoutId={tag}
                key={tag}
                exit="fadeOut"
              />
            ))}
      </AnimatePresence>
    </div>
  )
}

function useTagsInitialOpacity() {
  const [initialOpacity, setInitialOpacity] = useState(1)

  useEffect(() => {
    setInitialOpacity(0)
  }, [])

  return initialOpacity
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
      className="will-change-[opacity,transform]"
      asChild
    >
      <motion.button
        {...rest}
        className={_selectedTags.length > 1 ? styles.chip : ''}
        data-selected={isSelected}
        style={{
          // fix to distorition on animation (border-radius distorts if size animates)
          // solution is to set style inline
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
