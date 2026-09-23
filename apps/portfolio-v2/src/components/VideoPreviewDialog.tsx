import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as HoverCard from "@radix-ui/react-hover-card";
import { transitions } from "@repo/utils";
import { AnimatePresence, motion } from "motion/react";
import {
	type ComponentProps,
	type ReactNode,
	useEffect,
	useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { useVideoControls } from "@/hooks/useVideoControls";
import Close from "@/icons/cross.svg?react";
import Pause from "@/icons/pause-big.svg?react";
import PlaySmall from "@/icons/play.svg?react";
import Play from "@/icons/play-big.svg?react";
import { cn } from "@/lib/general";
import { buttonStyles } from "./Button";
import styles from "./VideoPreviewDialog.module.css";

type Props = {
	children: ReactNode;
} & VideoProps;

const btnClassName = twMerge(
	buttonStyles({
		className:
			"inline-flex h-auto cursor-pointer items-center justify-center gap-1.5 px-2 align-middle",
		translucent: true,
	})
);

export default function VideoPreviewDialog({ children, src, type }: Props) {
	const [open, setOpen] = useState(false);
	return (
		<DialogPrimitive.Root onOpenChange={setOpen} open={open}>
			<HoverCard.Root closeDelay={0} openDelay={0}>
				<HoverCard.Trigger asChild>
					<DialogPrimitive.Trigger className={btnClassName}>
						<PlaySmall aria-hidden="true" height={12} width={10} />
						<span>{children}</span>
					</DialogPrimitive.Trigger>
				</HoverCard.Trigger>

				<HoverCard.Portal>
					<HoverCard.Content
						align="center"
						className={`${styles.hoverContent} z-10 overflow-clip rounded-xl`}
						side="top"
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
						<DialogPrimitive.Title className="sr-only">
							{children} video preview
						</DialogPrimitive.Title>
						<DialogVideo open={open} src={src} type={type} />

						<div
							className={`${styles.gradientBg} fixed inset-x-0 top-0 z-10 flex items-center justify-end pt-4 pr-4 md:hidden`}
						>
							<DialogPrimitive.Close
								aria-label="Close video preview"
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
		<video muted playsInline preload="metadata" {...props}>
			<source src={src} type={type} />
		</video>
	);
}

function DialogVideo({ open, src, type }: VideoProps & { open: boolean }) {
	const [videoRef, { state, toggle }] = useVideoControls();

	useEffect(() => {
		if (!open) {
			return;
		}

		const video = videoRef.current;
		return () => {
			video?.pause();
		};
	}, [open, videoRef]);

	return (
		<div className="group relative grid w-[calc(75vw)] max-w-100 place-items-center">
			<Video ref={videoRef} src={src} type={type} />

			<button
				aria-label={state === "playing" ? "Pause video" : "Play video"}
				className={cn(
					"absolute inset-0 grid cursor-pointer place-items-center bg-overlay/20 opacity-0 transition-all duration-250 focus-visible:opacity-100 group-hover:opacity-100",
					state === "paused" && "opacity-100"
				)}
				onClick={toggle}
				type="button"
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
			</button>
		</div>
	);
}

function AnimateVideoIcon({ children }: { children: ReactNode }) {
	return (
		<motion.span
			animate={{ opacity: 1, scale: 1 }}
			className="absolute"
			exit={{ opacity: 0, scale: 0.8 }}
			initial={{ opacity: 0, scale: 0.8 }}
			transition={transitions.punchy}
		>
			{children}
		</motion.span>
	);
}
