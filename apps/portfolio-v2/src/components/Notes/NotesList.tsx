import { useStore } from "@nanostores/react";
import { cx } from "cva";
import { LayoutGroup } from "motion/react";
import { type CSSProperties, useLayoutEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import type { NoteFrontmatter } from "@/lib/notes";
import { $selectedTags } from "@/stores/notes";
import { MotionNoteCard } from "../NoteCard/NoteCard";
import styles from "./styles.module.css";

type Note = NoteFrontmatter & { selected: boolean; href: string };
type Props = {
	className?: string;
	notes: Omit<Note, "selected">[];
};

// estimated height per note (server render only; replaced by measured heights
// once hydrated, see useFitMasonryHeight)
const HEIGHT = 100;
const CARD_MARGIN_BOTTOM = 12;

const toRem = (num: number) => `${num / 16}rem`;

export default function NotesList(props: Props) {
	const { notes, className } = props;
	const _selectedTags = useStore($selectedTags);
	const listRef = useFitMasonryHeight();

	const isSelecting = Boolean(_selectedTags.length);

	const filtered: Note[] = [];
	const rest: Note[] = [];
	for (const note of notes) {
		if (
			isSelecting &&
			_selectedTags.every((selectedTag) => note.tags.includes(selectedTag))
		) {
			filtered.push({ ...note, selected: true });
		} else {
			rest.push({ ...note, selected: false });
		}
	}

	// fixed height is needed (relative height will cause for the container to assume 100% height for its height)
	const smHeight = toRem(
		Math.ceil(notes.length / 2) * (HEIGHT + CARD_MARGIN_BOTTOM)
	);
	const mdHeight = toRem(
		Math.ceil(notes.length / 3) * (HEIGHT + CARD_MARGIN_BOTTOM)
	);

	return (
		<div
			className={twMerge(
				cx(className, styles.notesList, [
					"h-full sm:h-(--smHeight) md:h-(--mdHeight)",
				])
			)}
			ref={listRef}
			style={
				{
					"--mason-mb": toRem(CARD_MARGIN_BOTTOM),
					"--mdHeight": mdHeight,
					"--smHeight": smHeight,
				} as CSSProperties
			}
		>
			<LayoutGroup>
				{filtered.map((note) => (
					<MotionNoteCard
						{...note}
						isSelecting={isSelecting}
						key={note.title}
					/>
				))}
				{rest.map((note) => (
					<MotionNoteCard
						{...note}
						isSelecting={isSelecting}
						key={note.title}
					/>
				))}
			</LayoutGroup>
		</div>
	);
}

// The masonry is a wrapping flex column, so its height decides where each
// column breaks. Child i sits in column i % cols (see styles.module.css), so
// size it to the tallest column. Re-runs after every render (filtering
// reorders cards) and whenever the list or a card resizes.
function useFitMasonryHeight() {
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const list = ref.current;
		if (!list) {
			return;
		}

		const fit = () => {
			const cards = [...list.children] as HTMLElement[];
			const cols = getColumnCount();
			const heights = Array.from({ length: cols }, (_, col) =>
				cards
					.filter((_card, i) => i % cols === col)
					.reduce((sum, card) => sum + getOuterHeight(card), 0)
			);
			list.style.height = `${Math.ceil(Math.max(...heights))}px`;
		};

		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(list);
		for (const card of list.children) {
			observer.observe(card);
		}
		return () => observer.disconnect();
	});

	return ref;
}

// Must match the breakpoints in styles.module.css.
function getColumnCount() {
	if (matchMedia("(min-width: 768px)").matches) {
		return 3;
	}
	if (matchMedia("(min-width: 640px)").matches) {
		return 2;
	}
	return 1;
}

function getOuterHeight(element: HTMLElement) {
	return (
		element.offsetHeight +
		Number.parseFloat(getComputedStyle(element).marginBottom)
	);
}
