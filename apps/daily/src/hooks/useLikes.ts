import type { Daily } from "contentlayer/generated";
import { useEffect, useState } from "react";
import { getAllLiked } from "@/lib/like";

export function useLikes() {
  const [likes, setLikes] = useState<Daily[]>([]);

  useEffect(() => {
    if (typeof localStorage === "object") setLikes(getAllLiked());
  }, []);

  return likes;
}
