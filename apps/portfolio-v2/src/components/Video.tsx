import type { HTMLAttributes } from "astro/types";
import { type ReactNode, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVideoControls } from "@/hooks/useVideoControls";
import { cn } from "@/lib/general";
import { browserIconButtonStyles } from "./BrowserIconButton/styles";

type Props = {
	children?: ReactNode;
	className?: string;
	pausedIcon?: ReactNode;
	playingIcon?: ReactNode;
	poster: string;
	src: string;
	type?: Exclude<HTMLAttributes<"source">["type"], null>;
};

export default function Video({
	src,
	poster,
	type = "video/mp4",
	pausedIcon,
	playingIcon,
	className,
}: Props) {
	const [videoRef, { state, toggle }] = useVideoControls();
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		const video = videoRef.current;
		if (!video) {
			return;
		}

		if (shouldReduceMotion) {
			video.pause();
		} else if (video.paused) {
			// Autoplay can be blocked by the browser; the control remains paused.
			video.play().catch(() => video.pause());
		}
	}, [shouldReduceMotion, videoRef]);

	return (
		<div className={cn("relative", className)}>
			<video
				controls={false}
				loop
				muted
				playsInline
				poster={poster}
				preload="none"
				ref={videoRef}
			>
				<source src={src} type={type} />
			</video>

			<button
				aria-label={state === "playing" ? "Pause video" : "Play video"}
				className={cn(
					browserIconButtonStyles(),
					"absolute right-4 bottom-4 translate-y-10 opacity-0 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-safe:transition-all motion-reduce:transition-none",
					state === "paused" && "translate-y-0 opacity-100"
				)}
				onClick={toggle}
				type="button"
			>
				<span
					className={cn(
						"absolute opacity-0",
						state === "paused" && "opacity-100"
					)}
				>
					{playingIcon}
				</span>
				<span
					className={cn(
						"absolute opacity-0",
						state === "playing" && "opacity-100"
					)}
				>
					{pausedIcon}
				</span>
			</button>
		</div>
	);
}
