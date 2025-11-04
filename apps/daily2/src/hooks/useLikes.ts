import { useEffect, useState } from "react";
import { getLikes } from "@/lib/actions";
import { getAllLikedDates, type Month } from "@/lib/like";

export function useLikes(month?: Month) {
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    if (typeof localStorage === "object") {
      const likedDates = getAllLikedDates(month);
      if (likedDates.length) {
        getLikes(likedDates).then(setLikes);
      } else {
        setLikes([]);
      }
    }
  }, [month]);

  return likes;
}

export type Like = Awaited<ReturnType<typeof getLikes>>[number];
