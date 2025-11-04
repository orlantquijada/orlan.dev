import { TZDate } from "@date-fns/tz";
import type { Metadata } from "next";
import DailyDetail from "@/components/DailyDetail";
import { getDaily } from "@/lib/content";
import type { DailyDate } from "@/lib/like";
import { stripMarkdown } from "@/lib/utils";

function getDailyDateToday(): DailyDate {
  const today = new TZDate(new Date(), "Asia/Manila");
  const month = today.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const day = today.getDate().toString();

  return { day, month };
}

export async function generateMetadata(): Promise<Metadata> {
  const { day, month } = getDailyDateToday();
  const { frontmatter } = await getDaily({ day, month });

  const cleanTitle = (await stripMarkdown(frontmatter.title)).toString();
  const cleanQuote = (await stripMarkdown(frontmatter.quote)).toString();

  return {
    title: cleanTitle,
    description: cleanQuote,
    metadataBase: new URL("https://clean-pugs-feel.loca.lt"),
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

export default async function Home() {
  const { day, month } = getDailyDateToday();
  const { Body, frontmatter } = await getDaily({ day, month });

  return (
    <DailyDetail Body={Body} date={{ day, month }} frontmatter={frontmatter} />
  );
}
