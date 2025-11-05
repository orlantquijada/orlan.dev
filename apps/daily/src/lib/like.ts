import { z } from "zod/mini";

export type Daily = {
  title: string;
  author: string;
  book: string;
  section: string;
  quote: string;
};

export type DailyDate = {
  month: string;
  day: string;
};

const DAILY_KEY = "__daily_/";
export function toKey({ day, month }: DailyDate) {
  return `${DAILY_KEY}${month}/${day}`;
}

export const monthSubjectsMap: Record<Month, string> = {
  january: "Clarity",
  febuary: "Passions and Emotion",
  march: "Awareness",
  april: "Unbiased Thought",
  may: "Right Action",
  june: "Problem Solving",
  july: "Duty",
  august: "Pragmatism",
  september: "Fortitude and Resilience",
  october: "Virtue and Kindness",
  november: "Acceptance",
  december: "Meditation On Mortality",
} as const;

export const monthSchema = z.enum([
  "january",
  "febuary",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
]);

export type Month = z.infer<typeof monthSchema>;

export function parseKey(key: string) {
  const [, month, day] = key.split("/");

  return {
    month,
    day,
  };
}

export function like(daily: DailyDate) {
  return localStorage.setItem(toKey(daily), JSON.stringify(true));
}
export function removeLike(daily: DailyDate) {
  return localStorage.removeItem(toKey(daily));
}
export function getIsLiked(daily: DailyDate) {
  return Boolean(localStorage.getItem(toKey(daily)));
}
export function getAllLikedDates(month?: Month): DailyDate[] {
  const monthsToCheck = month ? [month] : monthSchema.options;
  return Object.keys(localStorage)
    .filter((key) =>
      monthsToCheck.some((_month) => key.startsWith(`${DAILY_KEY}${_month}`))
    )
    .map(parseKey);
}
