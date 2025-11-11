"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import {
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";
import useSWR, { type Fetcher } from "swr";
import { type Daily, type DailyDate, monthSchema } from "@/lib/like";
import { stripMarkdown } from "@/lib/utils";
import styles from "./PreviewToast.module.css";

const variants: Variants = {
  hide: { y: "30%", opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function PreviewToast({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}) {
  const month = selectedDate
    ? monthSchema.options[selectedDate.getMonth()]
    : undefined;
  const day = selectedDate ? selectedDate.getDate() : undefined;

  const { data: daily, error } = useSWR(
    selectedDate ? { month, day } : null,
    fetcher,
  );

  useEffect(() => {
    function hideOnEsc(event: KeyboardEvent) {
      if (event.code === "Escape") {
        setSelectedDate(undefined);
      }
    }

    window.addEventListener("keydown", hideOnEsc);

    return () => window.removeEventListener("keydown", hideOnEsc);
  }, [setSelectedDate]);

  const loading = !(daily || error);

  return (
    <AnimatePresence mode="wait">
      {selectedDate && (
        <motion.div
          animate="show"
          className="fixed inset-x-0 bottom-(--content-padding-y) z-10 mx-auto flex h-(--toast-height) w-[calc(100%-var(--viewport-padding))] max-w-[calc(var(--content-max-width)-var(--viewport-padding))] items-center justify-between gap-4 rounded-lg border border-olive-6 bg-olive-1 p-3"
          exit="hide"
          initial="hide"
          key={selectedDate.toString()}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          variants={variants}
        >
          {loading ? (
            <div className={styles.loadingTitleSkeleton} />
          ) : daily ? (
            <Title>{daily.title}</Title>
          ) : (
            <Title>No content yet!</Title>
          )}

          {daily ? (
            <Link
              className="grid h-full place-items-center rounded-sm bg-transparent px-2 text-base text-olive-11 transition-[box-shadow,background-color] hover:bg-olive-3 focus:bg-olive-3 focus:outline-none focus:ring-2 focus:ring-olive-7 focus:ring-offset-2 md:px-3 md:text-lg"
              href={`/${month}/${day}`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              View
            </Link>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Title(props: ComponentProps<"span">) {
  return (
    <span
      {...props}
      className="block truncate font-bold text-base text-olive-11 md:text-lg"
    />
  );
}

//////////////////////////////////////////////////////////////////

const fetcher: Fetcher<Daily, DailyDate> = async ({ day, month }) => {
  const res = await fetch(`api/${month}/${day}`);

  if (!res.ok) {
    const error: Error & { info: unknown; status: number } = {
      ...new Error("An error occurred while fetching the data."),
      info: await res.json(),
      status: res.status,
    };
    throw error;
  }

  const { title, ...props } = (await res.json()) as Daily;

  const strippedTitle = await stripMarkdown(title);

  return { ...props, title: strippedTitle.toString() };
};
