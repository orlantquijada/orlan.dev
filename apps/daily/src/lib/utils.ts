import { TZDate } from "@date-fns/tz";
import clsx, { type ClassValue } from "clsx";
import { remark } from "remark";
import strip from "strip-markdown";
import { twMerge } from "tailwind-merge";
import type { DailyDate } from "./like";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export function stripMarkdown(markdown: string) {
  return remark().use(strip).process(markdown);
}

export function getDailyDateToday(): DailyDate {
  const today = new TZDate(new Date(), "Asia/Manila");
  const month = today.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const day = today.getDate().toString();

  return { day, month };
}

export function capitalize<T extends string>(str: T) {
  return `${str[0].toUpperCase()}${str.slice(1)}` as Capitalize<T>;
}
