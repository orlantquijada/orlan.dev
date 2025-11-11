"use client";

import { AnimatePresence, motion } from "motion/react";
import { type Ref, useImperativeHandle, useState } from "react";
import styles from "./CopiedLinkToast.module.css";

type CopiedLinkToastActions = {
  open: () => void;
};

const TOAST_DURATION = 2000;

type CopiedLinkToastProps = {
  ref?: Ref<CopiedLinkToastActions>;
};

export type CopiedLinkToast = CopiedLinkToastActions;
export function CopiedLinkToast({ ref }: CopiedLinkToastProps) {
  const [open, setOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open() {
        setOpen(true);

        setTimeout(() => {
          setOpen(false);
        }, TOAST_DURATION);
      },
    }),
    [],
  );

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          animate="show"
          className={`${styles.container} fixed inset-x-0 top-(--header-height) z-999 mx-auto flex items-center justify-center rounded-lg border border-olive-6 bg-olive-4 p-3 text-olive-11`}
          exit="hide"
          initial="hide"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          variants={variants}
        >
          Link Copied
        </motion.div>
      )}
    </AnimatePresence>
  );
}
CopiedLinkToast.displayName = "CopiedLinkToast";

const variants = {
  hide: { y: "-30%", opacity: 0 },
  show: { y: 0, opacity: 1 },
};
