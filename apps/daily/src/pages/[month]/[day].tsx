import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { allDailies, type Daily } from 'contentlayer/generated'
import { Month } from 'src/lib/contentlayer'
import DailyDetail from '@/components/DailyDetail'

export default function EntryDetailPage({
  daily,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <DailyDetail daily={daily} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allDailies.map(({ day, month }) => ({
    params: { month: month.toLowerCase(), day: day.toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  { daily: Daily },
  { month: Lowercase<Month>; day: string }
> = async ({ params }) => {
  if (!params) return { notFound: true }

  return {
    props: {
      daily: allDailies.find(
        ({ day, month }) =>
          day.toString() === params.day && month.toLowerCase() === params.month
      ) as Daily,
    },
  }
}
