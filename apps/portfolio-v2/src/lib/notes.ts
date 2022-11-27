export type NoteFrontmatter = {
  title: string
  description?: string
  tags: string[]
  publishedAt: Date
}

export function getNoteFilename(file: string) {
  const split = file.split('/')
  return split[split.length - 1]?.split('.')[0]
}

export type TagMap = Map<string, Set<string>>

// ! TO FIX
export function buildTagMap(...noteTags: string[][]): TagMap {
  const categoryGraph: TagMap = new Map()

  for (const tags of noteTags) {
    for (const tag of tags) {
      const _tag = categoryGraph.get(tag)

      // build nodes
      if (!_tag) categoryGraph.set(tag, new Set(tags.filter((t) => t !== tag)))
      else {
        for (const t of tags) {
          if (t !== tag) _tag.add(t)
        }
      }
    }
  }

  return categoryGraph
}

export function intersectionSet<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  return new Set([...s1].filter((x) => s2.has(x)))
}
