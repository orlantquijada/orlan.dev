import type { CollectionEntry } from 'astro:content'

export type TagGraphMap = Map<string, Set<string>>
export type NoteFrontmatter = CollectionEntry<'notes'>['data']

export function buildTagGraph(...noteTags: string[][]): TagGraphMap {
  const tagGraph: TagGraphMap = new Map()

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

// Node Neighborhood Intersection
// http://olizardo.bol.ucla.edu/classes/soc-111/lessons-winter-2022/2-lesson-graph-theory.html#node-neighborhood-intersection
export function getNeighborhoodsIntersection(
  graph: TagGraphMap,
  nodes: string[]
) {
  if (nodes.length === 0) return []

  let intersection = graph.get(nodes[0] as string) as Set<string>
  for (const node of nodes) {
    intersection = intersectionSet(intersection, graph.get(node) as Set<string>)
  }

  return [...intersection]
}

export function getViewTransitionName(title: NoteFrontmatter['title']) {
  return title.toLowerCase().replaceAll(' ', '-')
}
