import { useStore } from "@nanostores/react";
import { transitions } from "@repo/utils";
import { cx } from "cva";
import { LayoutGroup, MotionConfig } from "motion/react";
import {
	type CSSProperties,
	type RefObject,
	useLayoutEffect,
	useRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
	const shouldReduceMotion = useReducedMotion();
	const listRef = useRef<HTMLDivElement>(null);
	useFitMasonryHeight(listRef);

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
			<MotionConfig
				reducedMotion={shouldReduceMotion ? "always" : "never"}
				transition={transitions.snappy}
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
			</MotionConfig>
		</div>
	);
}

// The masonry is a wrapping flex column, so its height decides where each
// column breaks. Child i sits in column i % cols (see styles.module.css), so
// set the height to the tallest column's measured total. Runs after every
// render (filtering reorders cards between columns) and on resize.
function useFitMasonryHeight(ref: RefObject<HTMLDivElement | null>) {
	useLayoutEffect(() => {
		const list = ref.current;
		if (!list) {
			return;
		}

		const fit = () => {
			let cols = 1;
			if (matchMedia("(min-width: 768px)").matches) {
				cols = 3;
			} else if (matchMedia("(min-width: 640px)").matches) {
				cols = 2;
			}
			const heights = new Array<number>(cols).fill(0);
			const children = [...list.children] as HTMLElement[];
			for (const [i, child] of children.entries()) {
				const marginBottom = Number.parseFloat(
					getComputedStyle(child).marginBottom
				);
				heights[i % cols] =
					(heights[i % cols] ?? 0) + child.offsetHeight + marginBottom;
			}
			list.style.height = `${Math.ceil(Math.max(...heights))}px`;
		};

		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(list);
		for (const child of list.children) {
			observer.observe(child);
		}
		return () => observer.disconnect();
	});
}
