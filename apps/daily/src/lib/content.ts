import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Daily, DailyDate } from "./like";

async function getAllCalendarFiles(dir: string) {
  const months = await fs.readdir(dir, { withFileTypes: true });

  const allFiles: string[] = [];

  for (const month of months) {
    if (!month.isDirectory()) {
      continue;
    }

    const monthPath = path.join(dir, month.name);
    const files = await fs.readdir(monthPath);

    for (const file of files) {
      if (file.endsWith(".mdx")) {
        allFiles.push(path.join(monthPath, file));
      }
    }
  }

  return allFiles;
}

export function getFiles() {
  return getAllCalendarFiles(path.join(process.cwd(), "src", "content"));
}

// Wrapped in React `cache()` so a single render pass scans the content dir once,
// even though `getValidDates`/`isValidDate` run from generateStaticParams,
// generateMetadata, and the page body. Per-request scope — no cross-request
// staleness, so the daily rollover stays correct.
export const getValidDates = cache(async (): Promise<DailyDate[]> => {
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
});

export async function isValidDate(date: DailyDate) {
  return Boolean(
    (await getValidDates()).find(
      ({ day, month }) => day === date.day && month === date.month
    )
  );
}

// Keyed on primitive (month, day) args, not the DailyDate object: React `cache()`
// compares args by reference, so two callers passing distinct `{ day, month }`
// literals for the same date would otherwise each re-parse the MDX. The public
// signature stays object-based for call sites.
const loadDaily = cache(async (month: string, day: string) => {
  const { default: Body, frontmatter } = await import(
    `@/content/${month}/${day}.mdx`
  );

  return { Body, frontmatter: frontmatter as Daily };
});

export function getDaily({ day, month }: DailyDate) {
  return loadDaily(month, day);
}
