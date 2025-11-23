import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as HoverCard from "@radix-ui/react-hover-card";
import { transitions } from "@repo/utils";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { useVideoControls } from "@/hooks/useVideoControls";
import Close from "@/icons/cross.svg?react";
import Pause from "@/icons/pause-big.svg?react";
import Play from "@/icons/play-big.svg?react";
import { cn } from "@/lib/general";
import styles from "./VideoPreviewDialog.module.css";

type Props = {
	children: ReactNode;
	icon?: ReactNode;
} & VideoProps;

export default function VideoPreviewDialog({
	children,
	icon,
	src,
	type,
}: Props) {
	return (
		<DialogPrimitive.Root>
			<HoverCard.Root closeDelay={0} openDelay={0}>
				<HoverCard.Trigger asChild>
					<DialogPrimitive.Trigger className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-gray-a6 bg-gray-a3 px-2 align-middle text-gray12 transition-all hover:border-gray-a7 hover:bg-gray-a4">
						{icon}
						<span>{children}</span>
					</DialogPrimitive.Trigger>
				</HoverCard.Trigger>

				<HoverCard.Portal>
					<HoverCard.Content
						align="center"
						className={`${styles.hoverContent} overflow-clip rounded-xl`}
						side="top"
						sideOffset={8}
					>
						<Video
							autoPlay
							height={435}
							loop
							src={src}
							type={type}
							width={200}
						/>
					</HoverCard.Content>
				</HoverCard.Portal>

				<DialogPrimitive.Portal>
					<DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-overlay data-[state=closed]:motion-safe:animate-hide data-[state=open]:motion-safe:animate-show" />
					<DialogPrimitive.Content className="-translate-1/2 fixed top-1/2 left-1/2 isolate z-50 grid w-fit place-items-center overflow-hidden rounded-xl shadow-sm data-[state=closed]:motion-safe:animate-hideContent data-[state=open]:motion-safe:animate-showContent md:w-fit">
						<DialogVideo src={src} type={type} />

						<div
							className={`${styles.gradientBg} fixed inset-x-0 top-0 z-10 flex items-center justify-end pt-4 pr-4 md:hidden`}
						>
							<DialogPrimitive.Close
								className={`${styles.close} grid size-16 cursor-pointer place-items-center rounded-xl transition-all active:scale-90 active:opacity-75`}
							>
								<Close />
							</DialogPrimitive.Close>
						</div>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</HoverCard.Root>
		</DialogPrimitive.Root>
	);
}

type VideoProps = {
	src: string;
	type?: Exclude<ComponentProps<"source">["type"], null>;
} & ComponentProps<"video">;

function Video({ src, type, ...props }: VideoProps) {
	return (
		<video muted {...props}>
			<source src={src} type={type} />
		</video>
	);
}

function DialogVideo({ src, type }: VideoProps) {
	const [videoRef, { state, toggle }] = useVideoControls();

	return (
		<div className="group relative grid w-[calc(75vw)] max-w-100 place-items-center">
			<Video onClick={toggle} ref={videoRef} src={src} type={type} />

			<div
				className={cn(
					"pointer-events-none absolute inset-0 grid place-items-center bg-overlay/20 opacity-0 transition-all duration-250 group-hover:opacity-100",
					state === "paused" && "opacity-100"
				)}
			>
				<AnimatePresence mode="popLayout">
					{state === "paused" && (
						<AnimateVideoIcon key="play">
							<Play className="text-gray1 dark:text-gray12" />
						</AnimateVideoIcon>
					)}
					{state === "playing" && (
						<AnimateVideoIcon key="pause">
							<Pause className="text-gray1 dark:text-gray12" />
						</AnimateVideoIcon>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

function AnimateVideoIcon({ children }: { children: ReactNode }) {
	return (
		<motion.span
			animate={{ scale: 1, opacity: 1 }}
			className="absolute"
			exit={{ scale: 0.8, opacity: 0 }}
			initial={{ scale: 0.8, opacity: 0 }}
			transition={transitions.punchy}
		>
			{children}
		</motion.span>
	);
}
