"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type DailyDate, toKey } from "@/lib/like";
import { useLocalStorage } from "./useLocalStorage";

function useIsLiked(daily: DailyDate) {
  const [isLiked, setIsLiked] = useLocalStorage(toKey(daily), false);

  return [isLiked, setIsLiked] as const;
}

const LikedContext = createContext<
  | readonly [boolean, (value: boolean | ((prev: boolean) => boolean)) => void]
  | undefined
>(undefined);

export function useLikedContext() {
  const context = useContext(LikedContext);

  if (!context) {
    throw new Error("useLikedContext must be used within LikedContext");
  }

  return context;
}

export function LikedContentProvider({
  children,
  daily,
}: {
  daily: DailyDate;
  children: ReactNode;
}) {
  const likedValue = useIsLiked(daily);

  return <LikedContext value={likedValue}>{children}</LikedContext>;
}
