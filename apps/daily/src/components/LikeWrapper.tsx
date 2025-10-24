// import Image from 'next/image'

import type { Daily } from "contentlayer/generated";
import { motion } from "motion/react";
import Head from "next/head";
import { type PropsWithChildren, useState } from "react";
import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { useDoubleClick } from "@/hooks/useDoubleClick";
import { like } from "@/lib/like";

// import Heart from '../../public/heart.webp'

const HEART_SIZE = 130;
const SKEW_DEG = 30;

type Props = PropsWithChildren<{
  onLike?: () => void;
}> &
  Pick<Daily, "month" | "day">;

export default function LikeWrapper({ children, month, day, onLike }: Props) {
  const [open, setOpen] = useState<
    false | { y: number; x: number; rotate: number; key: number }
  >(false);

  const handler = useDoubleClick(
    (e) => {
      setOpen({
        x: e.pageX,
        y: e.pageY,
        rotate: 0,
        key: new Date().getTime(),
      });
      like({ month, day });
      onLike?.();
    },
    { delay: 300 }
  );

  return (
    <>
      <Head>
        <link as="image" href="/heart.webp" rel="preload" />
      </Head>
      <Container
        onClick={handler}
        /* onClick={(e) => { */
        /*   if (timer.current) { */
        /*     clearTimeout(timer.current) */
        /*     timer.current = null */
        /**/
        /*     // do something */
        /*     setOpen({ */
        /*       x: e.pageX, */
        /*       y: e.pageY, */
        /*       rotate: 0, */
        /*       key: new Date().getTime(), */
        /*     }) */
        /*     like({ month, day }) */
        /*     onLike?.() */
        /*   } else { */
        /*     timer.current = setTimeout(() => { */
        /*       timer.current = null */
        /*     }, DELAY) */
        /*   } */
        /* }} */
      >
        {children}

        {/* TODO: preload heart png */}
        {open ? (
          <motion.div
            animate={{
              scale: [1, 0.85, 1, 1, 1.3],
              y: -120,
              opacity: 0,
            }}
            className={css({
              width: HEART_SIZE,
              height: HEART_SIZE,
              userSelect: "none",
            })}
            initial={{
              y: "-50%",
              x: "-50%",
              top: open.y,
              left: open.x,
              position: "absolute",
              rotate: `${getRandomInt(-SKEW_DEG, SKEW_DEG)}deg`,
            }}
            key={open.key}
            onAnimationComplete={() => setOpen(false)}
            transition={{
              scale: { delay: 0, times: [0, 0.15, 0.3, 0.5, 1] },
              delay: 0.5,
            }}
          >
            <HeartImage />
          </motion.div>
        ) : null}
      </Container>
    </>
  );
}

function HeartImage() {
  // return (
  //   <Image
  //     // src="/heart.png"
  //     src={Heart}
  //     alt="Heart"
  //     objectFit="fill"
  //     width={HEART_SIZE}
  //     height={HEART_SIZE}
  //     priority
  //   />
  // )
  return (
    <picture>
      <img
        alt="Heart"
        // src="heart.svg"
        height={HEART_SIZE}
        src="/heart.webp"
        style={{ objectFit: "fill" }}
        width={HEART_SIZE}
      />
    </picture>
  );
}

const Container = styled("div", {
  base: {
    position: "relative",
    overflow: "clip",
    maxWidth: "100vw",
  },
});

function getRandomInt(min: number, max: number) {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1)) + min;
}
