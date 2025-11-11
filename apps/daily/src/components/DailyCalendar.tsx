"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format, isSameDay, isThisMonth } from "date-fns";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import * as Calendar from "@/components/Calendar";
import UTurnLeftIcon from "@/icons/UTurnLeftIcon";
import { type Month, monthSchema, monthSubjectsMap } from "@/lib/like";
import { cn } from "@/lib/utils";
import styles from "./DailyCalendar.module.css";
import PreviewToast from "./PreviewToast";

const Months = monthSchema.options;
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getPreviousMonth(month: Month) {
  const indexOfPrevMonth = Months.indexOf(month) - 1;
  return Months[
    indexOfPrevMonth < Months.indexOf("january")
      ? Months.indexOf("december")
      : indexOfPrevMonth
  ];
}

export function getNextMonth(month: Month) {
  const indexOfNextMonth = Months.indexOf(month) + 1;
  return Months[
    indexOfNextMonth > Months.indexOf("december")
      ? Months.indexOf("january")
      : indexOfNextMonth
  ];
}

export function getMonthToday() {
  const today = new Date();
  return Months[today.getMonth()];
}

function monthToDate(month: Month) {
  const year = new Date().getFullYear();
  // Convert month name to month index
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  return new Date(year, monthIndex, 1);
}

export default function DailyCalendar() {
  const pathname = usePathname();
  const month = pathname.slice(1) as Month;

  const [currentMonthDate, setCurrentMonthDate] = useState(() =>
    monthToDate(month),
  );
  const [selectedDate, setSelectedDate] = useState<Date>();

  const previousMonth = getPreviousMonth(month);
  const nextMonth = getNextMonth(month);

  useEffect(() => {
    setCurrentMonthDate(monthToDate(month));
  }, [month]);

  const x = useMotionValue(0);
  const opacity = useTransform(
    x,
    [-NAVIGATION_OFFSET, 0, NAVIGATION_OFFSET],
    [0.1, 1, 0.1],
  );

  return (
    <>
      <Calendar.Root defaultDate={currentMonthDate} value={currentMonthDate}>
        <header className="flex w-full items-center md:justify-between">
          <h1 className="text-base md:text-xl">
            {format(currentMonthDate, "MMM y")}
          </h1>

          <motion.h2
            className="ml-2.5 text-base text-olive-11 italic md:ml-[initial] md:text-xl"
            style={{ opacity }}
          >
            {monthSubjectsMap[month]}
          </motion.h2>

          <div className="ml-auto flex md:ml-[initial]">
            {!isThisMonth(currentMonthDate) && (
              <Link
                className={calendarButtonClassName}
                href={`/${getMonthToday()}`}
              >
                <span>
                  <UTurnLeftIcon />
                </span>
              </Link>
            )}

            <Link
              className={calendarButtonClassName}
              href={`/${previousMonth}`}
            >
              <span>
                <ChevronLeftIcon />
              </span>
            </Link>

            <Link className={calendarButtonClassName} href={`/${nextMonth}`}>
              <span>
                <ChevronRightIcon />
              </span>
            </Link>
          </div>
        </header>

        <div className="flex w-full flex-col gap-4">
          <div className="grid grid-cols-7">
            {weekdays.map((weekday) => (
              <span
                className="text-center text-base text-olive-11 md:text-left"
                key={weekday}
              >
                {weekday}
              </span>
            ))}
          </div>

          <Days
            next={() => {
              window.history.pushState(null, "", `/${nextMonth}`);
            }}
            opacity={opacity}
            prev={() => {
              window.history.pushState(null, "", `/${previousMonth}`);
            }}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            x={x}
          />
        </div>
      </Calendar.Root>
      <PreviewToast
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </>
  );
}

const NAVIGATION_OFFSET = 100;

function Days({
  selectedDate,
  setSelectedDate,
  next,
  prev,
  opacity,
  x,
}: {
  next: () => void;
  prev: () => void;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  x: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const { days } = Calendar.useCalendarContext();

  const selected = (date: Date) =>
    selectedDate && isSameDay(date, selectedDate);

  return (
    <motion.div
      className="pb-20"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const offset = info.offset.x;

        if (offset > 0 && offset > NAVIGATION_OFFSET) {
          prev();
        } else if (offset < 0 && offset < -NAVIGATION_OFFSET) {
          next();
        }
      }}
      style={{ x, opacity }}
    >
      <div className="grid grid-cols-7 md:border md:border-olive-3">
        {days.map(({ date, isInCurrentMonth, isToday }) => (
          <button
            className={cn(
              styles.day,
              "grid h-16 cursor-pointer place-items-center border-t border-t-olive-3 bg-background p-4 text-base text-foreground leading-none transition-colors duration-75 hover:bg-olive-2 focus:outline-olive-7 md:h-25 md:place-items-start md:border md:border-olive-3",
              isToday &&
                "relative text-olive-10 before:absolute before:size-[2em] before:rounded-full before:bg-olive-3 md:before:top-[0.5em] md:before:left-[0.5em]",
              selected(date) && "underline",
              !isInCurrentMonth && "text-olive-8",
            )}
            key={date.toString()}
            onClick={() => setSelectedDate(date)}
            onDragStart={(e) => e.preventDefault()}
            type="button"
          >
            <span className="z-10">{format(date, "d")}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const calendarButtonClassName =
  "flex size-8 cursor-pointer items-center justify-center rounded-sm border-none bg-none text-olive-11 transition-shadow focus-within:outline-none focus-within:ring-2 focus-within:ring-olive-7 hover:text-olive-12 active:outline-none active:ring-2 active:ring-olive-7 [&_span]:flex [&_span]:items-center [&_span]:justify-center";
