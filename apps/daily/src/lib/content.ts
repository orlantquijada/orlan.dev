import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import type { Daily, DailyDate } from "./like";

async function getAllCalendarFiles(dir: string) {
  const months = await fs.readdir(dir, { withFileTypes: true });

  const allFiles = [];

  for (const month of months) {
    if (!month.isDirectory()) continue;

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

export async function getValidDates(): Promise<DailyDate[]> {
  "use cache";
  cacheLife("max");
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

export async function isValidDate(date: DailyDate) {
  return Boolean(
    (await getValidDates()).find(
      ({ day, month }) => day === date.day && month === date.month,
    ),
  );
}

export async function getDaily({ day, month }: DailyDate) {
  const { default: Body, frontmatter } = await import(
    `@/content/${month}/${day}.mdx`
  );

  return { Body, frontmatter: frontmatter as Daily };
}
