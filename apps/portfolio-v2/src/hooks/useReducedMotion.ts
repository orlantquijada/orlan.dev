import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
	const media = window.matchMedia(query);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
	return window.matchMedia(query).matches;
}

// SSR must not emit autoplay or moving content before hydration.
const getServerSnapshot = () => true;

export function useReducedMotion() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
