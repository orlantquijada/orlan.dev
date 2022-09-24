import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { allDailies, type Daily } from 'contentlayer/generated'
import { Month } from 'src/lib/contentlayer'
import DailyDetail from '@/components/DailyDetail'
import Head from 'next/head'
import { getDailies } from '@/lib/api'
import { capitalize, getSocialMediaImage } from '@/lib/utils'

export default function EntryDetailPage({
  daily,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const image = getSocialMediaImage(daily)

  return (
    <>
      <Head>
        <title>{daily.title.raw}</title>
        <meta name="description" content={daily.quote.raw} />
        <link rel="icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="image" content={image} />
        <meta itemProp="image" content={image} />
        <meta name="twitter:image" content={image} />
        <meta property="og:image" content={image} />
      </Head>
      <DailyDetail daily={daily} />
    </>
  )
}

export async function getStaticPaths() {
  const paths = allDailies.map(({ day, month }) => ({
    params: { month: month.toLowerCase(), day: day.toString() },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  { daily: Daily },
  { month: Lowercase<Month>; day: string }
> = async ({ params }) => {
  if (!params) return { notFound: true }

  const { day, month } = params
  const daily = getDailies({
    filter: { day: parseInt(day, 10), month: capitalize(month) },
  })

  if (!daily.length) return { notFound: true }

  return {
    props: {
      daily: daily[0],
    },
  }
}
