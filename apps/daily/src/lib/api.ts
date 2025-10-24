import { TZDate } from "@date-fns/tz";
import { allDailies, type Daily } from "contentlayer/generated";

import { type Month, Months } from "./contentlayer";
import { type FilterFalseProps, type KeysFlag, pickProps } from "./utils";

type FilterKeys = Extract<keyof Daily, "author" | "day" | "month">;
type BetterTypedDaily = Daily & { month: Month };

function filterByKey<Key extends FilterKeys>(
  dailies: Daily[],
  key: Key,
  value: BetterTypedDaily[Key]
) {
  return dailies.filter((daily) => daily[key] === value);
}

export function getDailies<
  Flags extends KeysFlag<Daily> = { [Key in keyof Daily]: true },
  Result = [FilterFalseProps<Flags>] extends [keyof Daily]
    ? Pick<Daily, FilterFalseProps<Flags>>
    : Daily,
>(
  options: {
    select?: Flags;
    filter?: Partial<Pick<BetterTypedDaily, FilterKeys>>;
  } = {}
): Result[] {
  const { select, filter } = options;

  let dailies = allDailies;

  if (filter) {
    const { author, day, month } = filter;

    if (month) {
      dailies = filterByKey(dailies, "month", month as Month);
    }
    if (day) {
      dailies = filterByKey(dailies, "day", day);
    }
    if (author) {
      dailies = filterByKey(dailies, "author", author);
    }
  }
  if (select) {
    dailies = dailies.map((daily) => pickProps(daily, select));
  }

  return dailies as unknown as Result[];
}

export function getDailyToday(timezone = "Asia/Manila") {
  // correctly display `Daily` today based on timezone if given
  // ^ above is necessary bec `getServerSideProps` uses UTC by default
  const today = new TZDate(new Date(), timezone);

  const dailyToday = getDailies({
    filter: { month: Months[today.getMonth()], day: today.getDate() },
  });

  if (dailyToday.length) {
    return dailyToday[0];
  }
}

export function getPreviousMonth(month: Month) {
  const indexOfPrevMonth = Months.indexOf(month) - 1;
  return Months[
    indexOfPrevMonth < Months.indexOf("January")
      ? Months.indexOf("December")
      : indexOfPrevMonth
  ];
}

export function getNextMonth(month: Month) {
  const indexOfNextMonth = Months.indexOf(month) + 1;
  return Months[
    indexOfNextMonth > Months.indexOf("December")
      ? Months.indexOf("January")
      : indexOfNextMonth
  ];
}

export function getMonthToday() {
  const today = new Date();
  return Months[today.getMonth()];
}
