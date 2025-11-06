import type { Metadata, Viewport } from "next";
import DailyCalendar from "@/components/DailyCalendar";
import { Likes } from "@/components/Likes";
import { type Month, monthSchema, monthSubjectsMap } from "@/lib/like";
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
  const { month } = await params;

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

export default async function MonthPage({ params: _ }: Props) {
  return (
    <main
      className={`${styles.main} mx-auto flex min-h-screen max-w-(--content-max-width) flex-col items-center gap-6 px-(--content-padding-x) pt-(--content-padding-y)`}
    >
      <DailyCalendar />
      <Likes />
    </main>
  );
}

export const dynamicParams = false;
