"use client";

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";

const CalendarContext = createContext<UseCalendarResult | undefined>(undefined);

export function useCalendarContext() {
  const context = useContext(CalendarContext);

  if (context === undefined) {
    throw new Error("Must be used within a CalendarProvider");
  }

  return context;
}

type UseCalendarOptions = {
  value?: Date;
  defaultDate?: Date;
  onChangeCurrentDate?: (date: Date) => void;
};

function useCalendar({
  defaultDate,
  onChangeCurrentDate,
  value,
}: UseCalendarOptions = {}) {
  const today = new Date();
  const [internalDate, setInternalDate] = useState(defaultDate ?? today);

  const currentDate = value ?? internalDate;

  const setCurrentDate = (date: Date) => {
    setInternalDate(date);
    onChangeCurrentDate?.(date);
  };

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start, end }).map((date) => ({
    date,
    isInCurrentMonth: isSameMonth(date, currentDate),
    isToday: isSameDay(date, today),
  }));

  return {
    currentDate,
    days,
    setCurrentDate,
    goToNextMonth: () => setCurrentDate(add(currentDate, { months: 1 })),
    goToPreviousMonth: () => setCurrentDate(sub(currentDate, { months: 1 })),
    reset: () => setCurrentDate(defaultDate ?? today),
  } as const;
}

export type UseCalendarResult = ReturnType<typeof useCalendar>;

export function Root({
  children,
  ...options
}: UseCalendarOptions & { children: ReactNode }) {
  const value = useCalendar(options);
  return <CalendarContext value={value}>{children}</CalendarContext>;
}

function CalendarActionButton({
  action,
  ...props
}: ComponentProps<"button"> & { action: () => void }) {
  return (
    <button
      {...props}
      onClick={(e) => {
        action();
        props.onClick?.(e);
      }}
    />
  );
}

export function PreviousMonthButton(props: ComponentProps<"button">) {
  const { goToPreviousMonth } = useCalendarContext();
  return <CalendarActionButton {...props} action={goToPreviousMonth} />;
}

export function NextMonthButton(props: ComponentProps<"button">) {
  const { goToNextMonth } = useCalendarContext();
  return <CalendarActionButton {...props} action={goToNextMonth} />;
}

export function ResetToTodayButton(props: ComponentProps<"button">) {
  const { reset } = useCalendarContext();
  return <CalendarActionButton {...props} action={reset} />;
}
