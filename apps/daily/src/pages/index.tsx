import type { Daily } from "contentlayer/generated";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import DailyDetail from "@/components/DailyDetail";
import MetaTags from "@/components/MetaTags";
import { getDailyToday } from "@/lib/api";
import { getDetailSocialMediaImage } from "@/lib/utils";

export default function Home({
  daily,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const image = getDetailSocialMediaImage({
    title: daily.title.raw,
    subtitle: `${daily.month} ${daily.day}`,
    author: daily.author,
  });

  return (
    <>
      <MetaTags
        description={daily.quote.raw}
        image={image}
        title={daily.title.raw}
        url=""
      />
      <DailyDetail daily={daily} />
    </>
  );
}

export async function getServerSideProps({
  query: { timezone },
  res,
}: GetServerSidePropsContext) {
  res.setHeader("Cache-Control", "public, no-cache");
  const dailyToday = getDailyToday(timezone as string);

  return {
    props: { daily: dailyToday as Daily },
    notFound: !dailyToday,
  };
}
