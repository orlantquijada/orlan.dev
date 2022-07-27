import {
  type GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Link from 'next/link'
import { allDailies, type Daily } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'

import { Months, type Month } from 'src/lib/contentlayer'

export default function MonthsNavPage({
  data,
  month,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      {month}
      {data.map((data) => (
        <Card data={data} key={data._id} />
      ))}
    </div>
  )
}

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
  { month: Lowercase<Month>; data: Data[] },
  { month: Lowercase<Month> }
> = async ({ params }) => {
  if (!params) return { notFound: true }

  return {
    props: {
      month: params.month,
      data: allDailies
        .filter(({ month }) => month.toLowerCase() === params.month)
        .map(({ _id, title, url }) => ({ _id, title, url })),
    },
  }
}
