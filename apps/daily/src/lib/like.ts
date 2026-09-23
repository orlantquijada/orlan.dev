import { z } from "zod/mini";

export type Daily = {
  author: string;
  book: string;
  quote: string;
  section: string;
  title: string;
};

export type DailyDate = {
  day: string;
  month: string;
};

const DAILY_KEY = "__daily_/";
export function toKey({ day, month }: DailyDate) {
  return `${DAILY_KEY}${month}/${day}`;
}

export const monthSubjectsMap: Record<Month, string> = {
  april: "Unbiased Thought",
  august: "Pragmatism",
  december: "Meditation On Mortality",
  febuary: "Passions and Emotion",
  january: "Clarity",
  july: "Duty",
  june: "Problem Solving",
  march: "Awareness",
  may: "Right Action",
  november: "Acceptance",
  october: "Virtue and Kindness",
  september: "Fortitude and Resilience",
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

export function isValidMonth(month: string) {
  return monthSchema.options.includes(month as Month);
}

export type Month = z.infer<typeof monthSchema>;

export function parseKey(key: string) {
  const [, month, day] = key.split("/");

  return {
    day,
    month,
  };
}

export function getAllLikedDates(month?: Month): DailyDate[] {
  const monthsToCheck = month ? [month] : monthSchema.options;
  return Object.keys(localStorage)
    .filter((key) =>
      monthsToCheck.some((_month) => key.startsWith(`${DAILY_KEY}${_month}`))
    )
    .filter((key) => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? "false") === true;
      } catch {
        return false;
      }
    })
    .map(parseKey);
}
