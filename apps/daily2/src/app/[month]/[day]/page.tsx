import type { Metadata } from "next";
import DailyDetail from "@/components/DailyDetail";
import { getDaily, getFiles } from "@/lib/content";
import { stripMarkdown } from "@/lib/utils";

type Props = {
  params: Promise<{ month: string; day: string }>;
};

export async function generateStaticParams() {
  const files = await getFiles();

  return files.map((fileName) => {
    const [month, day] = fileName.split("/").slice(-2);

    // removes file extension
    const _day = day.split(".")[0];

    return {
      month,
      day: _day,
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { day, month } = await params;
  const { frontmatter } = await getDaily({ day, month });
  const cleanTitle = (await stripMarkdown(frontmatter.title)).toString();
  const cleanQuote = (await stripMarkdown(frontmatter.quote)).toString();

  return {
    title: cleanTitle,
    metadataBase: new URL("https://clean-pugs-feel.loca.lt"),
    description: cleanQuote,
    openGraph: {
      title: cleanTitle,
      description: cleanQuote,
      url: `https://clean-pugs-feel.loca.lt/${month}/${day}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanQuote,
    },
  };
}

export default async function EntryDetailPage({ params }: Props) {
  const { day, month } = await params;
  const { Body, frontmatter } = await getDaily({ day, month });

  return (
    <DailyDetail Body={Body} date={{ day, month }} frontmatter={frontmatter} />
  );
}

export const dynamicParams = false;
