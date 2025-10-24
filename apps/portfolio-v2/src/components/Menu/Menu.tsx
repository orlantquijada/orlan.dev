import * as PopoverPrimitive from "@radix-ui/react-popover";
import { transitions } from "@repo/utils";
import { cva } from "cva";
import {
	AnimatePresence,
	MotionConfig,
	motion,
	type Variants,
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
			<PopoverPrimitive.Root onOpenChange={setOpen} open={open}>
				<div class="relative ml-auto flex">
					<PopoverPrimitive.Trigger asChild>
						<motion.button
							animate={open ? "open" : "closed"}
							class={twMerge(
								buttonStyles({
									className: "z-10 flex items-center gap-3",
									motionSafe: false,
								})
							)}
							initial="closed"
							style={{
								border: "none",
								background: "none",
								boxShadow: "none",
							}}
							variants={buttonVariants}
						>
							<MenuIcon />
							{open ? "Close" : "Menu"}
						</motion.button>
					</PopoverPrimitive.Trigger>
					<PopoverPrimitive.Anchor asChild>
						<div
							class={twMerge(
								buttonStyles({
									className: "absolute inset-0",
									translucent: true,
								})
							)}
							id="portal-container"
							ref={containerRef as RefObject<HTMLDivElement>}
						/>
					</PopoverPrimitive.Anchor>
				</div>

				<AnimatePresence>
					{open && (
						<PopoverPrimitive.Portal
							container={containerRef.current}
							forceMount
							key="portal"
						>
							<PopoverPrimitive.Content
								align="end"
								// 40 = button height
								asChild
								sideOffset={-40}
							>
								<motion.div
									animate="open"
									class={twMerge(contentStyles({ translucent: true }))}
									exit="closed"
									initial="closed"
									style={{
										transformOrigin:
											"var(--radix-popover-content-transform-origin)",
									}}
									transition={{
										type: "tween",
										duration: 0.2,
									}}
									variants={panelVariants}
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
	const [topLineMotionProps, bottomLineMotionProps] = useMemo(
		() => [getLineMotionProps(1), getLineMotionProps(-1)],
		[]
	);

	return (
		<svg class="h-[1em] w-[1em] stroke-gray10" viewBox="0 0 24 24">
			<title>Menu Icon</title>
			<motion.path
				d="M1 8H23"
				strokeLinecap="round"
				strokeWidth="2"
				{...topLineMotionProps}
			/>
			<motion.path
				d="M1 16H23"
				strokeLinecap="round"
				strokeWidth="2"
				{...bottomLineMotionProps}
			/>
		</svg>
	);
}

const contentStyles = cva(
	[
		"max-h-[80vh] overflow-hidden p-8 pb-0",
		"rounded-lg border border-gray7 bg-gray1 shadow-sm dark:border-gray6",
		styles.menuContent,
	],
	{
		variants: {
			translucent: {
				true: [
					"dark:bg-gray-a3",
					// 'dark:backdrop-blur-md dark:backdrop-brightness-75 dark:saturate-200 dark:contrast-75',
					"dark:backdrop-blur-md dark:backdrop-brightness-75",
				],
				false: ["dark:bg-gray3"],
			},
		},
		defaultVariants: {
			translucent: false,
		},
	}
);
