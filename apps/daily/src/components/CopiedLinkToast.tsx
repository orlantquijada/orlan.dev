import { AnimatePresence, motion } from "motion/react";
import { type Ref, useImperativeHandle, useState } from "react";
import { cva } from "styled-system/css";

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
    []
  );

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          animate="show"
          className={container()}
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

const container = cva({
  base: {
    backgroundColor: "olive.4",
    color: "olive.11",
    borderRadius: "0.5rem",
    border: "1px solid",
    borderColor: "olive.6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: "0.75rem",
    zIndex: 999,

    "--viewportPadding": "calc(var(--contentPX) * 2)",
    height: "var(--toastHeight)",
    position: "fixed",
    top: "var(--headerHeight)",
    left: 0,
    right: 0,
    mx: "auto",
    width: "calc(100% - var(--viewportPadding))",
    maxWidth: "calc(var(--contentMaxWidth) - var(--viewportPadding))",
  },
});
