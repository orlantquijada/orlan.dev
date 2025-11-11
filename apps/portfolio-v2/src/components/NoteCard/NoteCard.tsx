import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

import { getViewTransitionName, type NoteFrontmatter } from "@/lib/notes";
import { noteCardStyles } from "./styles";

export type NoteCardProps = NoteFrontmatter & {
	href: string;
};

export default function NoteCard(props: NoteCardProps) {
	const { title, description, href } = props;

	return (
		<a class={twMerge(noteCardStyles())} href={href}>
			<h3 class="font-medium">{title}</h3>
			{description ? (
				<p class="text-gray10 text-sm dark:text-gray11">{description}</p>
			) : null}
		</a>
	);
}

export type MotionNoteCardProps = NoteCardProps & {
	selected: boolean;
	isSelecting: boolean;
};

// ! temp solution cause i dont want a motion component wrapper div
// e.g. <motion.div><NoteCard/></motion.div>
export function MotionNoteCard(props: MotionNoteCardProps) {
	const { title, description, href, selected, isSelecting, wip } = props;

	return (
		<motion.a
			animate={isSelecting ? { opacity: selected ? 1 : 0.3 } : {}}
			class={twMerge(
				noteCardStyles({
					stripes: wip,
					className: "will-change-[opacity,transform]",
				}),
			)}
			href={href}
			layoutId={title}
		>
			<h1
				class="font-medium"
				style={
					{
						viewTransitionName: getViewTransitionName(title),
					} as CSSProperties
				}
			>
				{title}
			</h1>
			{description ? (
				<p class="text-gray10 text-sm dark:text-gray11">{description}</p>
			) : null}
		</motion.a>
	);
}
