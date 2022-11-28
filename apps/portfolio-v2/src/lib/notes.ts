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

export function buildTagGraph(...noteTags: string[][]): TagMap {
  const tagGraph: TagMap = new Map()

  for (const tags of noteTags) {
    for (const tag of tags) {
      const node = tagGraph.get(tag)

      if (!node) tagGraph.set(tag, new Set(tags.filter((_tag) => _tag !== tag)))
      else {
        for (const _tag of tags) {
          if (_tag !== tag) node.add(_tag)
        }
      }
    }
  }

  return tagGraph
}

export function intersectionSet<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  return new Set([...s1].filter((x) => s2.has(x)))
}
