"use client";

import { ArrowLeftIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { motion } from "motion/react";
import Link from "next/link";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLikedContext } from "@/hooks/useLikedContext";
import {
  useIsMinWidthTabDimensions,
  useShowActions,
} from "@/hooks/useShowActions";
import HeartSvg from "@/icons/HeartSvg";
import ShareSvg from "@/icons/ShareSvg";
import { BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import styles from "./Actions.module.css";
import { CopiedLinkToast } from "./CopiedLinkToast";

const list = {
  visible: {
    height: "100%",
    transition: { staggerChildren: 0.125 },
  },
  hidden: { height: "var(--icon-button-size)" },
};

export default function Actions({
  day,
  month,
}: {
  day: string;
  month: string;
}) {
  const [open, setOpen] = useState(true);
  const [isLiked, setIsLiked] = useLikedContext();
  const toastRef = useRef<CopiedLinkToast>(null);
  const shouldShow = useShowActions();
  const [isMinTabDimes] = useIsMinWidthTabDimensions();
  const ref = useRef<HTMLDivElement>(null);

  const loading = isMinTabDimes === undefined;

  useClickOutside(ref, () => {
    if (!isMinTabDimes) {
      setOpen(false);
    }
  });

  useEffect(() => {
    if (!loading) {
      setOpen(isMinTabDimes);
    }
  }, [isMinTabDimes, loading]);

  if (loading) {
    return null;
  }

  return (
    <>
      <footer
        className={cn(
          styles.footer,
          "fixed inset-x-0 bottom-4 mx-auto flex flex-col md:bottom-10",
        )}
      >
        <motion.div
          animate={open ? "visible" : "hidden"}
          className={cn(
            styles.actionsContainer,
            "flex w-(--icon-button-size) flex-col-reverse items-center justify-start overflow-hidden rounded-lg bg-olive-4 opacity-100 focus-within:bg-olive-4 focus-within:opacity-100 focus-within:ring-2 focus-within:ring-background hover:bg-olive-4 hover:opacity-100 md:bg-transparent md:opacity-75",
            shouldShow ? "opacity-100 md:opacity-75" : "opacity-0",
          )}
          initial={open ? "visible" : "hidden"}
          ref={ref}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          variants={list}
        >
          <FooterButton
            className="mt-2 mb-1"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
            size="small"
          >
            <IconMotionWrapper>
              <DotsHorizontalIcon className={footerBtnIconStyles()} />
            </IconMotionWrapper>
          </FooterButton>

          <Link
            className={footerButtonStyles({ size: "small" })}
            href={`/${month}`}
          >
            <IconMotionWrapper>
              <ArrowLeftIcon className={footerBtnIconStyles()} />
            </IconMotionWrapper>
          </Link>

          <FooterButton
            onClick={() => {
              navigator.clipboard
                .writeText(`${BASE_URL}/${month}/${day}`)
                .then(() => {
                  // TODO:
                  toastRef.current?.open();
                });
            }}
            size="small"
          >
            <IconMotionWrapper>
              <ShareSvg className={footerBtnIconStyles()} />
            </IconMotionWrapper>
          </FooterButton>

          <FooterButton
            className="mt-1"
            onClick={() => {
              setIsLiked((prev) => !prev);
            }}
            size="small"
          >
            <IconMotionWrapper
              animate={
                isLiked
                  ? {
                      scale: [0.8, 1.3, 1],
                      rotate: [0, 25, 0],
                      transition: { ease: ["easeOut", "easeIn"] },
                    }
                  : {
                      scale: 1,
                    }
              }
            >
              <HeartSvg
                className={footerBtnIconStyles(
                  isLiked ? { className: "text-liked" } : {},
                )}
              />
            </IconMotionWrapper>
          </FooterButton>
        </motion.div>
      </footer>

      <CopiedLinkToast ref={toastRef} />
    </>
  );
}

function footerButtonStyles({
  size = "normal",
  className,
}: {
  size?: "small" | "normal";
  className?: string;
} = {}) {
  return cn(
    styles.footerButton,
    "flex aspect-square w-(--icon-button-size) shrink-0 cursor-pointer items-center justify-center rounded-sm border-none bg-transparent p-0 focus-within:bg-olive-2 focus-within:outline-none hover:bg-olive-2 hover:outline-none",
    size === "small" && "w-[calc(var(--icon-button-size)-0.5rem)]",
    className,
  );
}

function footerBtnIconStyles({ className }: { className?: string } = {}) {
  return cn("size-5 text-olive-11 md:size-6", className);
}

function FooterButton({
  size = "normal",
  ...props
}: ComponentProps<typeof motion.button> & { size?: "small" | "normal" }) {
  return (
    <motion.button
      {...props}
      className={footerButtonStyles({ size, className: props.className })}
    />
  );
}

function IconMotionWrapper(props: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      // animations don't work well with css transitions
      whileTap={{
        scale: 0.8,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 17,
        },
      }}
      {...props}
      className={cn(
        "grid h-full w-full scale-100 place-items-center",
        props.className,
      )}
    />
  );
}
