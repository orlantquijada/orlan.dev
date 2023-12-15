import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkSmartypants from 'remark-smartypants'
import { getDateFromPath, MonthSubjectsMap } from './src/lib/contentlayer'

export const Daily = defineDocumentType(() => ({
  name: 'Daily',
  filePathPattern: '*/[0-3][0-9].md*',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'mdx',
      required: true,
    },
    author: {
      type: 'enum',
      options: [
        'Marcus Aurelius',
        'Seneca',
        'Epictetus',
        'Musonius Rufus',
        'Diogenes Laertius',
        'Zeno',
        'Chrysippus',
        'Plutarch',
      ],
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
      type: 'mdx',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (daily) => {
        const { day, month } = getDateFromPath(daily._raw.flattenedPath)
        return `/${month}/${day}`.toLowerCase()
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
      type: 'string',
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
  documentTypes: [Daily],
  mdx: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore type issue
    remarkPlugins: [[remarkSmartypants]],
  },
})

export default source
