import { atom, action } from 'nanostores'

export const selectedTags = atom<string[]>([])

export const addTag = action(selectedTags, 'addTag', (store, tag) =>
  store.set([...store.get(), tag]),
)

export const removeTag = action(
  selectedTags,
  'removeTag',
  (store, tagToRemove) =>
    store.set(store.get().filter((tag) => tagToRemove !== tag)),
)

export const clearTags = action(selectedTags, 'clearTags', (store) =>
  store.set([]),
)
