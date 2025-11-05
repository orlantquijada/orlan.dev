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

function useCalendar({
  defaultDate,
  onChangeCurrentDate,
  value,
}: {
  value?: Date;
  defaultDate?: Date;
  onChangeCurrentDate?: (date: Date) => void;
} = {}) {
  const today = new Date();
  const [_currentDate, setCurrentDate] = useState(defaultDate || today);

  const currentDate = value ? value : _currentDate;

  const handleChangeDate = (date: Date) => {
    setCurrentDate(date);
    onChangeCurrentDate?.(date);
  };

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start, end }).map((date) => ({
    date,
    isInCurrentMonth: isSameMonth(date, currentDate),
    isToday: isSameDay(date, today),
  }));

  const handleNext = () => setCurrentDate(add(currentDate, { months: 1 }));
  const handlePrevious = () => setCurrentDate(sub(currentDate, { months: 1 }));
  const handleReset = () => setCurrentDate(defaultDate || today);

  return {
    currentDate,
    setCurrentDate: handleChangeDate,
    handleNext,
    handlePrevious,
    days,
    handleReset,
  } as const;
}

export type UseCalendarResult = ReturnType<typeof useCalendar>;

export function Root({
  children,
  defaultDate,
  onChangeCurrentDate,
  value: valueProp,
}: {
  value?: Date;
  children: ReactNode;
  defaultDate?: Date;
  onChangeCurrentDate?: (date: Date) => void;
}) {
  const value = useCalendar({
    defaultDate,
    onChangeCurrentDate,
    value: valueProp,
  });
  return <CalendarContext value={value}>{children}</CalendarContext>;
}

export function PreviousMonthButton(props: ComponentProps<"button">) {
  const { handlePrevious } = useCalendarContext();

  return (
    <button
      {...props}
      onClick={(e) => {
        handlePrevious();

        if (props.onClick) {
          props.onClick(e);
        }
      }}
    />
  );
}

export function NextMonthButton(props: ComponentProps<"button">) {
  const { handleNext } = useCalendarContext();

  return (
    <button
      {...props}
      onClick={(e) => {
        handleNext();

        if (props.onClick) {
          props.onClick(e);
        }
      }}
    />
  );
}

export function ResetToTodayButton(props: ComponentProps<"button">) {
  const { handleReset } = useCalendarContext();

  return (
    <button
      {...props}
      onClick={(e) => {
        handleReset();

        if (props.onClick) {
          props.onClick(e);
        }
      }}
    />
  );
}
