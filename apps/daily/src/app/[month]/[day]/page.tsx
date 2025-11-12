import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import DailyDetail from "@/components/DailyDetail";
import { getDaily, getValidDates, isValidDate } from "@/lib/content";
import { stripMarkdown } from "@/lib/utils";

type Props = {
  params: Promise<{ month: string; day: string }>;
};

export async function generateStaticParams() {
  return await getValidDates();
}

export const viewport: Viewport = {
  themeColor: "#fcfdfc",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { day, month } = await params;

  if (!(await isValidDate({ day, month }))) {
    notFound();
  }

  const { frontmatter } = await getDaily({ day, month });
  const cleanTitle = (await stripMarkdown(frontmatter.title)).toString();
  const cleanQuote = (await stripMarkdown(frontmatter.quote)).toString();

  return {
    title: cleanTitle,
    description: cleanQuote,
    openGraph: {
      title: cleanTitle,
      description: cleanQuote,
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

  if (!(await isValidDate({ day, month }))) {
    notFound();
  }

  const { Body, frontmatter } = await getDaily({ day, month });

  return (
    <Suspense>
      <DailyDetail
        Body={Body}
        date={{ day, month }}
        frontmatter={frontmatter}
      />
    </Suspense>
  );
}

export const dynamicParams = false;
