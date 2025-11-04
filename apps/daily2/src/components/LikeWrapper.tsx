"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type ReactNode, useState } from "react";
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

  return (
    //  biome-ignore lint/a11y/noStaticElementInteractions: intentional
    <div
      className="relative max-w-screen overflow-clip"
      onDoubleClick={(e) => {
        setOpen({
          x: e.pageX,
          y: e.pageY,
          rotate: 0,
          key: Date.now(),
        });

        setIsLiked(true);
      }}
    >
      {children}

      {open ? (
        <motion.div
          animate={{
            scale: [1, 0.85, 1, 1, 1.3],
            y: -120,
            opacity: 0,
          }}
          className="absolute aspect-square select-none"
          initial={{
            y: "-50%",
            x: "-50%",
            top: open.y,
            left: open.x,
            rotate: `${getRandomInt(-SKEW_DEG, SKEW_DEG)}deg`,
          }}
          key={open.key}
          onAnimationComplete={() => setOpen(false)}
          style={{ width: HEART_SIZE }}
          transition={{
            scale: { delay: 0, times: [0, 0.15, 0.3, 0.5, 1] },
            delay: 0.5,
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
    <Image
      alt="Heart"
      height={HEART_SIZE}
      preload
      src="/heart.webp"
      width={HEART_SIZE}
    />
  );
}

function getRandomInt(min: number, max: number) {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1)) + min;
}
