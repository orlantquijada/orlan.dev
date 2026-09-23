import type { Metadata, Viewport } from "next";
import DailyDetail from "@/components/DailyDetail";
import { getDaily } from "@/lib/content";
import { getDailyDateToday, stripMarkdown } from "@/lib/utils";

export const viewport: Viewport = {
  themeColor: "#fcfdfc",
};

export async function generateMetadata(): Promise<Metadata> {
  const { day, month } = getDailyDateToday();
  const { frontmatter } = await getDaily({ day, month });

  const cleanTitle = (await stripMarkdown(frontmatter.title)).toString();
  const cleanQuote = (await stripMarkdown(frontmatter.quote)).toString();

  return {
    description: cleanQuote,
    openGraph: {
      description: cleanQuote,
      title: cleanTitle,
      type: "article",
    },
    title: cleanTitle,
    twitter: {
      card: "summary_large_image",
      description: cleanQuote,
      title: cleanTitle,
    },
  };
}

export default async function Home() {
  const { day, month } = getDailyDateToday();
  const { Body, frontmatter } = await getDaily({ day, month });

  return (
    <DailyDetail Body={Body} date={{ day, month }} frontmatter={frontmatter} />
  );
}

export const dynamic = "force-dynamic";
