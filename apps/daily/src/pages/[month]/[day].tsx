import { allDailies, type Daily } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { Month } from "src/lib/contentlayer";
import DailyDetail from "@/components/DailyDetail";
import MetaTags from "@/components/MetaTags";
import { getDailies } from "@/lib/api";
import { capitalize, getDetailSocialMediaImage } from "@/lib/utils";

export default function EntryDetailPage({
  daily,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
        url={`/${daily.month.toLowerCase()}/${daily.day}`}
      />
      <DailyDetail daily={daily} />
    </>
  );
}

export async function getStaticPaths() {
  const paths = allDailies.map(({ day, month }) => ({
    params: { month: month.toLowerCase(), day: day.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps<
  { daily: Daily },
  { month: Lowercase<Month>; day: string }
> = async ({ params }) => {
  if (!params) return { notFound: true };

  const { day, month } = params;
  const daily = getDailies({
    filter: { day: Number.parseInt(day, 10), month: capitalize(month) },
  });

  if (!daily.length) return { notFound: true };

  return {
    props: {
      daily: daily[0],
    },
  };
};
