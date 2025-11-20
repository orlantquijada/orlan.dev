import type { HTMLAttributes } from "astro/types";
import {
	type ComponentRef,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/general";
import { browserIconButtonStyles } from "./BrowserIconButton/styles";

type Props = {
	src: string;
	type?: Exclude<HTMLAttributes<"source">["type"], null>;
	pausedIcon?: ReactNode;
	playingIcon?: ReactNode;
	children?: ReactNode;
	className?: string;
};

export default function Video({
	src,
	type = "video/mp4",
	pausedIcon,
	playingIcon,
	className,
}: Props) {
	const videoRef = useRef<ComponentRef<"video">>(null);
	const [state, setState] = useState<"playing" | "paused">();

	useEffect(() => {
		if (videoRef.current) {
			setState(videoRef.current.paused ? "paused" : "playing");
		}
	}, []);

	return (
		<div className={cn("relative", className)}>
			<video
				autoPlay
				controls={false}
				loop
				muted
				onPause={() => {
					setState("paused");
				}}
				onPlay={() => {
					setState("playing");
				}}
				playsInline
				preload="none"
				ref={videoRef}
			>
				<source src={src} type={type} />
			</video>

			<button
				className={cn(
					browserIconButtonStyles(),
					"absolute right-4 bottom-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
					state === "paused" && "translate-y-0 opacity-100"
				)}
				onClick={() => {
					if (!videoRef.current) {
						return;
					}

					if (videoRef.current.paused) {
						videoRef.current.play();
						setState("playing");
					} else {
						videoRef.current.pause();
						setState("paused");
					}
				}}
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
