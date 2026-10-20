import { atom } from "nanostores";

type Tag = string;

export const $selectedTags = atom<Tag[]>([]);

// False while the selection is being seeded from the URL, so arriving on
// /notes?tags=… shows that state at once instead of animating from "all".
// Chip clicks happen after it flips back to true, so they still animate.
export const $tagAnimationsEnabled = atom(false);

const INSTANT = { duration: 0 } as const;
export const tagTransition = <T>(enabled: boolean, transition: T) =>
	enabled ? transition : INSTANT;

export function addTag(tag: Tag) {
	$selectedTags.set([...$selectedTags.get(), tag]);
}

export function removeTag(tag: Tag) {
	$selectedTags.set($selectedTags.get().filter((_tag) => tag !== _tag));
}

export function clearTags() {
	$selectedTags.set([]);
}

// --- URL <-> selected-tags sync (notes index deep-linking) ---

function readTagsFromURL(validTags: Tag[]): Tag[] {
	if (typeof location === "undefined") {
		return [];
	}
	const raw = new URLSearchParams(location.search).get("tags");
	if (!raw) {
		return [];
	}
	const valid = new Set(validTags);
	const tags = raw
		.split(",")
		.map(decodeURIComponent)
		.filter((tag) => valid.has(tag));
	// Dedupe so a hand-edited `?tags=css,css` can't render the same chip twice.
	return [...new Set(tags)];
}

// Seed the store from `?tags=` (ignoring unknown tags). Call on mount and on
// `astro:page-load` so view-transition navigations re-seed too.
export function initTagsFromURL(validTags: Tag[]) {
	$tagAnimationsEnabled.set(false);
	$selectedTags.set(readTagsFromURL(validTags));
	// Two frames: let the seeded state commit and paint before re-enabling.
	requestAnimationFrame(() =>
		requestAnimationFrame(() => $tagAnimationsEnabled.set(true))
	);
}

// Reflect the current selection back into the URL via replaceState so filtered
// views are shareable/reloadable without spamming the history stack.
export function syncTagsToURL() {
	if (typeof history === "undefined") {
		return;
	}
	const tags = $selectedTags.get();
	const url = new URL(location.href);
	if (tags.length) {
		url.searchParams.set("tags", tags.map(encodeURIComponent).join(","));
	} else {
		url.searchParams.delete("tags");
	}
	history.replaceState(history.state, "", url);
}
