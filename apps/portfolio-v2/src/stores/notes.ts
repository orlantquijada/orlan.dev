import { atom } from "nanostores";

type Tag = string;

export const $selectedTags = atom<Tag[]>([]);

export function addTag(tag: Tag) {
	$selectedTags.set([...$selectedTags.get(), tag]);
}

export function removeTag(tag: Tag) {
	$selectedTags.set($selectedTags.get().filter((_tag) => tag !== _tag));
}

export function clearTags() {
	$selectedTags.set([]);
}
