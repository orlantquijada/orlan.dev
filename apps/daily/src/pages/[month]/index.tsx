import {
  type GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Link from 'next/link'
import { allDailies, type Daily } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'

import { Months, type Month } from 'src/lib/contentlayer'
import { css } from '@stitches.config'
import Calendar from '@/components/Calendar'
import { useRouter } from 'next/router'

export default function MonthsNavPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { query } = useRouter()
  const currentMonth = capitalize(query.month as Lowercase<Month>)

  return (
    <div className={main()}>
      {currentMonth}
      {data.map((data) => (
        <Card data={data} key={data._id} />
      ))}

      <Calendar month={currentMonth} />
    </div>
  )
}

const main = css({
  maxWidth: '650px',
  mx: 'auto',
})

function Card({ data: { title, url } }: { data: Data }) {
  const Title = useMDXComponent(title.code)
  return (
    <div>
      <Link href={url}>
        <a>
          <Title />
        </a>
      </Link>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Months.map((month) => ({
    params: { month: month.toLowerCase() },
  }))

  return {
    paths,
    fallback: false,
  }
}

type Data = Pick<Daily, '_id' | 'title' | 'url'>

export const getStaticProps: GetStaticProps<
  { data: Data[] },
  { month: Lowercase<Month> }
> = async ({ params }) => {
  if (!params) return { notFound: true }

  return {
    props: {
      data: allDailies
        .filter(({ month }) => month.toLowerCase() === params.month)
        .map(({ _id, title, url }) => ({ _id, title, url })),
    },
  }
}

function capitalize<T extends string>(str: T) {
  return `${str[0].toUpperCase()}${str.slice(1)}` as Capitalize<T>
}
