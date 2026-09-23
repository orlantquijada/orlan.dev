import { type ComponentRef, useEffect, useRef, useState } from "react";

export function useVideoControls() {
	const videoRef = useRef<ComponentRef<"video">>(null);
	const [state, setState] = useState<"playing" | "paused">("paused");

	useEffect(() => {
		const video = videoRef.current;
		if (!video) {
			return;
		}

		const onPlay = () => setState("playing");
		const onPause = () => setState("paused");
		video.addEventListener("play", onPlay);
		video.addEventListener("pause", onPause);
		video.addEventListener("ended", onPause);
		setState(video.paused ? "paused" : "playing");

		return () => {
			video.removeEventListener("play", onPlay);
			video.removeEventListener("pause", onPause);
			video.removeEventListener("ended", onPause);
		};
	}, []);

	const toggle = () => {
		const video = videoRef.current;
		if (!video) {
			return;
		}

		if (video.paused) {
			video.play().catch(() => {
				if (video.paused) {
					setState("paused");
				}
			});
		} else {
			video.pause();
		}
	};

	const controls = { state, toggle };

	return [videoRef, controls] as const;
}
