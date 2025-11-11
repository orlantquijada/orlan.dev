import type { Metadata, Viewport } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import DailyCalendar from "@/components/DailyCalendar";
import { Likes } from "@/components/Likes";
import {
  isValidMonth,
  type Month,
  monthSchema,
  monthSubjectsMap,
} from "@/lib/like";
import { capitalize } from "@/lib/utils";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ month: Month }>;
};

export async function generateStaticParams() {
  return monthSchema.options.map((month) => ({ month }));
}

export const viewport: Viewport = {
  themeColor: "#fcfdfc",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  "use cache";
  cacheLife("max");

  const { month } = await params;

  if (!isValidMonth(month)) {
    notFound();
  }

  const capitalizedMonth = capitalize(month);
  const subject = monthSubjectsMap[month];

  const title = `${capitalizedMonth} — ${subject}`;

  return {
    title,
    description: subject,
    openGraph: {
      title,
      description: subject,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: subject,
    },
  };
}

export default async function MonthPage({ params }: Props) {
  "use cache";
  cacheLife("weeks");

  const { month } = await params;

  if (!isValidMonth(month)) {
    notFound();
  }

  return (
    <main
      className={`${styles.main} mx-auto flex min-h-screen max-w-(--content-max-width) flex-col items-center gap-6 px-(--content-padding-x) pt-(--content-padding-y)`}
    >
      <Suspense>
        <DailyCalendar />
      </Suspense>
      <Likes />
    </main>
  );
}
