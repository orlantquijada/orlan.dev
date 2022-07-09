import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import { getDateFromPath, MonthSubjectsMap } from './src/lib/contentlayer'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/*.md*',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}))

export const Daily = defineDocumentType(() => ({
  name: 'Daily',
  filePathPattern: 'daily/*/[0-3][0-9].md*',
  fields: {
    title: {
      type: 'markdown',
      required: true,
    },
    author: {
      type: 'enum',
      options: ['Marcus Aurelius', 'Seneca', 'Epictetus', 'Musonius Rufus'],
      required: true,
    },
    book: {
      type: 'string',
      required: true,
    },
    section: {
      type: 'string',
      required: true,
    },
    quote: {
      type: 'markdown',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (daily) => {
        const { day, month } = getDateFromPath(daily._raw.flattenedPath)
        return `/daily/${month}/${day}`.toLowerCase()
      },
    },
    day: {
      type: 'number',
      resolve: (daily) => {
        const { day } = getDateFromPath(daily._raw.flattenedPath)
        return day
      },
    },
    month: {
      type: 'enum',
      resolve: (daily) => {
        const { month } = getDateFromPath(daily._raw.flattenedPath)
        return month
      },
    },
    monthSubject: {
      type: 'string',
      resolve: (daily) => {
        const { month } = getDateFromPath(daily._raw.flattenedPath)
        return MonthSubjectsMap[month]
      },
    },
  },
}))

const source = makeSource({
  contentDirPath: 'src/data',
  documentTypes: [Post, Daily],
})

export default source
