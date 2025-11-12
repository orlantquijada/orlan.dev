import type { Metadata, Viewport } from "next";
import { getDailyDateToday } from "@/lib/utils";

export const viewport: Viewport = {
  themeColor: "#fcfdfc",
};

export async function generateMetadata() {
  const { day, month } = getDailyDateToday();

  return {
    title: new Date().toString(),
    description: `${day} ${month}`,
  } satisfies Metadata;
}

export default async function HelloPage() {
  return <div>{new Date().toString()}</div>;
}

export const dynamic = "force-dynamic";
