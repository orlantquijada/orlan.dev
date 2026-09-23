"use client";

import { motion } from "motion/react";
import { type MouseEvent, type ReactNode, useCallback, useState } from "react";
import { useLikedContext } from "@/hooks/useLikedContext";

const HEART_SIZE = 130;
const SKEW_DEG = 30;

type Props = {
  children: ReactNode;
};

export default function LikeWrapper({ children }: Props) {
  const [open, setOpen] = useState<
    false | { y: number; x: number; rotate: number; key: number }
  >(false);
  const [, setIsLiked] = useLikedContext();
  const handleDoubleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      setOpen({
        key: Date.now(),
        rotate: 0,
        x: event.pageX,
        y: event.pageY,
      });

      setIsLiked(true);
    },
    [setIsLiked]
  );
  const handleAnimationComplete = useCallback(() => setOpen(false), []);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: intentional
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: intentional
    <div
      className="relative max-w-screen overflow-clip"
      onDoubleClick={handleDoubleClick}
    >
      {children}

      {open ? (
        <motion.div
          animate={{
            opacity: 0,
            scale: [1, 0.85, 1, 1, 1.3],
            y: -120,
          }}
          className="absolute aspect-square select-none"
          initial={{
            left: open.x,
            rotate: `${getRandomInt(-SKEW_DEG, SKEW_DEG)}deg`,
            top: open.y,
            x: "-50%",
            y: "-50%",
          }}
          key={open.key}
          onAnimationComplete={handleAnimationComplete}
          style={{ width: HEART_SIZE }}
          transition={{
            delay: 0.5,
            scale: { delay: 0, times: [0, 0.15, 0.3, 0.5, 1] },
          }}
        >
          <HeartImage />
        </motion.div>
      ) : null}
    </div>
  );
}

function HeartImage() {
  return (
    // biome-ignore lint/performance/noImgElement: 3KB asset, next/image optimizer roundtrip adds latency on first interaction
    <img alt="Heart" height={HEART_SIZE} src="/heart.webp" width={HEART_SIZE} />
  );
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
