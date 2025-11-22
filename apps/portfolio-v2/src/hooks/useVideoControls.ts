import { type ComponentRef, useEffect, useRef, useState } from "react";

export function useVideoControls() {
	const videoRef = useRef<ComponentRef<"video">>(null);
	const [state, setState] = useState<"playing" | "paused">();

	useEffect(() => {
		if (videoRef.current) {
			setState(videoRef.current.paused ? "paused" : "playing");
		}
	}, []);

	const play = () => {
		if (!videoRef.current) {
			return;
		}

		videoRef.current.play();
		setState("playing");
	};

	const pause = () => {
		if (!videoRef.current) {
			return;
		}

		videoRef.current.pause();
		setState("paused");
	};

	const toggle = () => {
		if (!videoRef.current) {
			return;
		}

		if (videoRef.current.paused) {
			videoRef.current.play();
			play();
		} else {
			videoRef.current.pause();
			pause();
		}
	};

	const controls = { state, play, pause, toggle };

	return [videoRef, controls] as const;
}
