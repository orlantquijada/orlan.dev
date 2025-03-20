import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useImperativeHandle, useState } from "react";
import { cva } from "styled-system/css";

type Ref = {
	open: () => void;
};

const TOAST_DURATION = 2000;

export type CopiedLinkToast = Ref;
export const CopiedLinkToast = forwardRef<Ref>((_, ref) => {
	const [open, setOpen] = useState(false);

	useImperativeHandle(
		ref,
		() => {
			return {
				open() {
					setOpen(true);

					setTimeout(() => {
						setOpen(false);
					}, TOAST_DURATION);
				},
			};
		},
		[],
	);

	return (
		<AnimatePresence exitBeforeEnter>
			{open && (
				<motion.div
					variants={variants}
					initial="hide"
					animate="show"
					exit="hide"
					transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
					className={container()}
				>
					Link Copied
				</motion.div>
			)}
		</AnimatePresence>
	);
});
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
