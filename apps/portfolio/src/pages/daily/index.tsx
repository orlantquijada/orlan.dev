import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from 'next'
import DailyDetail from '@components/daily/DailyDetail'
import { getDailyToday } from 'src/lib/daily'
import { Daily } from 'contentlayer/generated'

export default function DailyPage({
  daily,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <DailyDetail daily={daily} />
}
DailyPage.theme = 'light'

export async function getServerSideProps({
  query: { timezone },
}: GetServerSidePropsContext) {
  const dailyToday = getDailyToday(timezone as string)

  return {
    props: { daily: dailyToday as Daily },
    notFound: !dailyToday,
  }
}
