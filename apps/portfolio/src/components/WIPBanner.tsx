import { Banner } from "components";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useState } from "react";
import type { CSS } from "styled";
import { css } from "styled/css";

const variants: Variants = {
	visible: {
		height: "auto",
		opacity: 1,
		transition: { delay: 0.5 },
	},
	hidden: {
		height: 0,
		opacity: 0,
	},
};

export default function WIPBanner({ css: cssProp }: { css?: CSS }) {
	const [open, setOpen] = useState(true);

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					layout
					key="banner"
					style={{ overflow: "hidden", transformOrigin: "top" }}
					variants={variants}
					initial="hidden"
					animate="visible"
					exit="hidden"
				>
					<Banner.Container className={css(cssProp)}>
						<Banner.Tag>In Progress</Banner.Tag>
						<Banner.Title>
							Hey There! This page is actively being iterated on.
						</Banner.Title>
						<Banner.Close onClick={() => setOpen(false)}>Close</Banner.Close>
					</Banner.Container>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
