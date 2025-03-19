import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

import { type NoteFrontmatter, getViewTransitionName } from "@/lib/notes";
import { noteCardStyles } from "./styles";

export type NoteCardProps = NoteFrontmatter & {
	href: string;
};

export default function NoteCard(props: NoteCardProps) {
	const { title, description, href } = props;

	return (
		<a href={href} className={twMerge(noteCardStyles())}>
			<h3 className="font-medium">{title}</h3>
			{description ? (
				<p className="text-sm text-gray10 dark:text-gray11">{description}</p>
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
			layoutId={title}
			animate={isSelecting ? { opacity: !selected ? 0.3 : 1 } : {}}
			href={href}
			className={twMerge(
				noteCardStyles({
					stripes: wip,
					className: "will-change-[opacity,transform]",
				}),
			)}
		>
			<h1
				className="font-medium"
				style={
					{
						viewTransitionName: getViewTransitionName(title),
					} as CSSProperties
				}
			>
				{title}
			</h1>
			{description ? (
				<p className="text-sm text-gray10 dark:text-gray11">{description}</p>
			) : null}
		</motion.a>
	);
}
