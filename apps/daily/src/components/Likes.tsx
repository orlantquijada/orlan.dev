"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Like, useLikes } from "@/hooks/useLikes";
import type { Month } from "@/lib/like";
import styles from "./Likes.module.css";

export function Likes() {
  const pathname = usePathname();
  const month = pathname.slice(1) as Month;
  const likes = useLikes(month);

  if (!likes.length) {
    return null;
  }

  const sortedLikes = likes.sort(
    (current, next) => Number(current.day) - Number(next.day),
  );

  return (
    <AnimatePresence mode="popLayout">
      <motion.section
        animate={{ opacity: 1 }}
        className="w-full"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        key={month}
      >
        <h2 className="font-bold text-olive-11 text-xl md:text-2xl">Liked</h2>

        <ol className="list-none p-0">
          {sortedLikes.map((like) => (
            <Card key={`${like.month}/${like.day}`} like={like} />
          ))}
        </ol>
      </motion.section>
    </AnimatePresence>
  );
}

function Card({ like }: { like: Like }) {
  return (
    <li className="not-first-of-type:border-t not-first-of-type:border-t-olive-3">
      <Link
        className={`${styles.likeContainer} -mx-2 grid px-2 py-4 transition-all hover:bg-olive-2`}
        href={`/${like.month}/${like.day}`}
      >
        <span
          className="flex items-end justify-end text-olive-9 capitalize md:justify-start"
          style={{ gridArea: "date" }}
        >
          {like.month.slice(0, 3)} {like.day}
        </span>
        <p
          className="block truncate font-bold text-base text-olive-11 md:mt-0 md:text-lg"
          style={{ gridArea: "title" }}
        >
          {like.title}
        </p>
        <span
          className="shrink-0 text-olive-11 md:ml-auto"
          style={{ gridArea: "author" }}
        >
          {like.author}
        </span>
      </Link>
    </li>
  );
}
