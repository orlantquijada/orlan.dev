import { allDailies, type Daily } from "contentlayer/generated";
import { type Month, Months } from "./contentlayer";

///////////////////////// util /////////////////////////

type BetterTypedDaily = Daily & { month: Month };
const DAILY_KEY = "__daily_/";
const getKey = ({ day, month }: Pick<Daily, "month" | "day">) =>
  `${DAILY_KEY}${month}/${day}`;
const parseKey = <T extends string = `${typeof DAILY_KEY}${Month}/${string}`>(
  key: T
) => {
  const [, month, _day] = key.split("/");

  const day = Number.parseInt(_day, 10);
  if (Months.includes(month as Month) && !Number.isNaN(day)) {
    return {
      success: true,
      data: { month: month as Month, day },
    } as const;
  }

  return {
    success: false,
  } as const;
};

///////////////////////// api /////////////////////////

export const like = (daily: Pick<Daily, "month" | "day">) => {
  localStorage.setItem(getKey(daily), JSON.stringify(true));
};
export const removeLike = (daily: Pick<Daily, "month" | "day">) =>
  localStorage.removeItem(getKey(daily));
export const getIsLiked = (daily: Pick<Daily, "month" | "day">) =>
  Boolean(localStorage.getItem(getKey(daily)));
export const getAllLiked = () => {
  type Like = Pick<BetterTypedDaily, "month" | "day">;
  const likes: Like[] = [];

  Object.keys(localStorage).forEach((key) => {
    for (const month of Months) {
      if (key.startsWith(`${DAILY_KEY}${month}`)) {
        const { success, data } = parseKey(key);
        if (success) {
          likes.push(data);
        }
      }
    }
  });
  return likes.map((like) =>
    allDailies.find(
      ({ month, day }) => month === like.month && day === like.day
    )
  ) as Daily[];
};
