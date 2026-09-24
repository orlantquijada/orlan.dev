import * as PopoverPrimitive from "@radix-ui/react-popover";
import { transitions } from "@repo/utils";
import { cva } from "cva";
import {
	AnimatePresence,
	MotionConfig,
	motion,
	type Variants,
} from "motion/react";
import { type RefObject, useCallback, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import { buttonStyles } from "../Button";
import { MenuPanel } from "./MenuPanel";
import styles from "./styles.module.css";

const panelVariants: Variants = {
	closed: {
		opacity: 0,
		scale: 0.95,
	},
	open: {
		opacity: 1,
		scale: 1,
	},
};

const buttonVariants: Variants = {
	closed: {
		x: 0,
		y: 0,
	},
	open: {
		x: "-20%",
		y: "45%",
	},
};

export function Menu() {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLElement>(null);
	const handleNavigate = useCallback(() => setOpen(false), []);
	const shouldReduceMotion = useReducedMotion();

	return (
		<MotionConfig
			reducedMotion={shouldReduceMotion ? "always" : "never"}
			transition={transitions.punchy}
		>
			<PopoverPrimitive.Root onOpenChange={setOpen} open={open}>
				<div className="relative ml-auto flex">
					<PopoverPrimitive.Trigger asChild>
						<motion.button
							animate={open ? "open" : "closed"}
							className={twMerge(
								buttonStyles({
									className: "z-10 flex items-center gap-3",
									motionSafe: false,
									withAnimations: false,
								})
							)}
							initial="closed"
							style={{
								background: "none",
								border: "none",
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
							className={twMerge(
								buttonStyles({
									className: "absolute inset-0",
									motionSafe: false,
									translucent: true,
									withAnimations: false,
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
									className={twMerge(contentStyles({ translucent: true }))}
									exit="closed"
									initial="closed"
									style={{
										transformOrigin:
											"var(--radix-popover-content-transform-origin)",
									}}
									transition={{
										duration: 0.2,
										type: "tween",
									}}
									variants={panelVariants}
								>
									<MenuPanel onNavigate={handleNavigate} />
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
			closed: {
				rotate: 0,
				y: 0,
			},
			open: {
				rotate: 45 * direction,
				y: 4 * direction,
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
		<svg className="h-[1em] w-[1em] stroke-gray10" viewBox="0 0 24 24">
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
		defaultVariants: {
			translucent: false,
		},
		variants: {
			translucent: {
				false: ["dark:bg-gray3"],
				true: [
					"dark:bg-gray-a3",
					// 'dark:backdrop-blur-md dark:backdrop-brightness-75 dark:saturate-200 dark:contrast-75',
					"dark:backdrop-blur-md dark:backdrop-brightness-75",
				],
			},
		},
	}
);
