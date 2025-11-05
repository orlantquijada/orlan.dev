"use server";

import { getDaily } from "./content";
import type { DailyDate } from "./like";
import { stripMarkdown } from "./utils";

export async function getLikes(dates: DailyDate[]) {
  const likes = await Promise.all(
    dates.map(async (date) => {
      const daily = await getDaily(date);
      const strippedTitle = (
        await stripMarkdown(daily.frontmatter.title)
      ).toString();

      return { ...daily.frontmatter, title: strippedTitle, ...date };
    })
  );

  return likes;
}
