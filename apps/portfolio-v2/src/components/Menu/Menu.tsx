import * as PopoverPrimitive from "@radix-ui/react-popover";
import { transitions } from "@repo/utils";
import { cva } from "cva";
import {
	AnimatePresence,
	MotionConfig,
	type Variants,
	motion,
} from "motion/react";
import { type RefObject, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { buttonStyles } from "../Button";
import { MenuPanel } from "./MenuPanel";
import styles from "./styles.module.css";

const panelVariants: Variants = {
	open: {
		opacity: 1,
		scale: 1,
	},
	closed: {
		opacity: 0,
		scale: 0.95,
	},
};

const buttonVariants: Variants = {
	open: {
		x: "-20%",
		y: "45%",
	},
	closed: {
		x: 0,
		y: 0,
	},
};

export function Menu() {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLElement>(null);

	return (
		<MotionConfig transition={transitions.punchy}>
			<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
				<div className="relative ml-auto flex">
					<PopoverPrimitive.Trigger asChild>
						<motion.button
							variants={buttonVariants}
							initial="closed"
							animate={open ? "open" : "closed"}
							style={{
								border: "none",
								background: "none",
								boxShadow: "none",
							}}
							className={twMerge(
								buttonStyles({
									className: "z-10 flex items-center gap-3",
									motionSafe: false,
								}),
							)}
						>
							<MenuIcon />
							{open ? "Close" : "Menu"}
						</motion.button>
					</PopoverPrimitive.Trigger>
					<PopoverPrimitive.Anchor asChild>
						<div
							ref={containerRef as RefObject<HTMLDivElement>}
							id="portal-container"
							className={twMerge(
								buttonStyles({
									className: "absolute inset-0",
									translucent: true,
								}),
							)}
						/>
					</PopoverPrimitive.Anchor>
				</div>

				<AnimatePresence>
					{open && (
						<PopoverPrimitive.Portal
							container={containerRef.current}
							key="portal"
							forceMount
						>
							<PopoverPrimitive.Content
								align="end"
								// 40 = button height
								sideOffset={-40}
								asChild
							>
								<motion.div
									variants={panelVariants}
									initial="closed"
									animate="open"
									exit="closed"
									style={{
										transformOrigin:
											"var(--radix-popover-content-transform-origin)",
									}}
									transition={{
										type: "tween",
										duration: 0.2,
									}}
									className={twMerge(contentStyles({ translucent: true }))}
								>
									<MenuPanel />
								</motion.div>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					)}
				</AnimatePresence>
			</PopoverPrimitive.Root>
		</MotionConfig>
	);
}

function getLineMotionProps(direction: -1 | 1) {
	return {
		variants: {
			open: {
				y: 4 * direction,
				rotate: 45 * direction,
			},
			closed: {
				y: 0,
				rotate: 0,
			},
		},
	};
}

function MenuIcon() {
	const [topLineMotionProps, bottomLineMotionProps] = useMemo(() => {
		return [getLineMotionProps(1), getLineMotionProps(-1)];
	}, []);

	return (
		<svg viewBox="0 0 24 24" className="h-[1em] w-[1em] stroke-gray10">
			<title>Menu Icon</title>
			<motion.path
				d="M1 8H23"
				strokeWidth="2"
				strokeLinecap="round"
				{...topLineMotionProps}
			/>
			<motion.path
				d="M1 16H23"
				strokeWidth="2"
				strokeLinecap="round"
				{...bottomLineMotionProps}
			/>
		</svg>
	);
}

const contentStyles = cva(
	[
		"max-h-[80vh] p-8 pb-0 overflow-hidden",
		"bg-gray1 border border-gray7 dark:border-gray6 shadow-sm rounded-lg",
		styles.menuContent,
	],
	{
		variants: {
			translucent: {
				true: [
					"dark:bg-grayA3",
					// 'dark:backdrop-blur-md dark:backdrop-brightness-75 dark:saturate-200 dark:contrast-75',
					"dark:backdrop-blur-md dark:backdrop-brightness-75",
				],
				false: ["dark:bg-gray3"],
			},
		},
		defaultVariants: {
			translucent: false,
		},
	},
);
