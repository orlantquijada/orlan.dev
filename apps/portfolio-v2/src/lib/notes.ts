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
