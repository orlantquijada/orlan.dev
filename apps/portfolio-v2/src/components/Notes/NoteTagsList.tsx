import { ReactComponent as Close } from "@/icons/cross.svg";
import { useStore } from "@nanostores/react";
import { transitions } from "@repo/utils";
import {
	AnimatePresence,
	LayoutGroup,
	MotionConfig,
	motion,
} from "motion/react";
import { type ComponentProps, forwardRef, useEffect, useState } from "react";

import { type TagGraphMap, getNeighborhoodsIntersection } from "@/lib/notes";
import { $selectedTags, addTag, clearTags, removeTag } from "@/stores/notes";
import Chip from "../Chip/Chip";

import styles from "./styles.module.css";

type Props = {
	tags: string[];
	tagsGraph: TagGraphMap;
};

export default function NoteTagsList(props: Props) {
	const { tags, tagsGraph } = props;
	const _selectedTags = useStore($selectedTags);
	const isSelecting = Boolean(_selectedTags.length);

	const visibleTags = getNeighborhoodsIntersection(tagsGraph, _selectedTags);

	const initialOpacity = useTagsInitialOpacity();

	return (
		<LayoutGroup>
			<div className="mt-6 flex flex-wrap justify-start gap-2 sm:max-w-[85%] md:gap-y-3">
				<MotionConfig transition={transitions.snappy}>
					<AnimatePresence mode="popLayout">
						{isSelecting ? (
							<Chip asChild>
								<motion.button
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									onClick={() => clearTags()}
								>
									<Close className={styles.icon} />
								</motion.button>
							</Chip>
						) : (
							<Chip color="primary" asChild>
								<motion.span exit={{ opacity: 0 }}>all</motion.span>
							</Chip>
						)}

						{_selectedTags.map((tag, index) =>
							index === 0 ? (
								<Tag
									tag={tag}
									layoutId={tag}
									key={tag}
									style={{ zIndex: 5 - index }}
								/>
							) : (
								<Tag
									tag={tag}
									custom={index}
									layoutId={tag}
									key={tag}
									style={{
										zIndex: 5 - index,

										paddingLeft: 36,
										marginLeft: -32,
										justifyContent: "flex-end",
									}}
								/>
							),
						)}

						{isSelecting
							? visibleTags.map((tag) => (
									<Tag
										tag={tag}
										initial={{ opacity: initialOpacity }}
										animate={{ opacity: 1 }}
										layoutId={tag}
										key={tag}
										exit={{ opacity: 0 }}
									/>
								))
							: tags.map((tag) => (
									<Tag
										tag={tag}
										initial={{ opacity: initialOpacity }}
										animate={{ opacity: 1 }}
										layoutId={tag}
										key={tag}
										exit={{ opacity: 0 }}
									/>
								))}
					</AnimatePresence>
				</MotionConfig>
			</div>
		</LayoutGroup>
	);
}

// initial opacity = 1 on hard page load
function useTagsInitialOpacity() {
	const [initialOpacity, setInitialOpacity] = useState(1);

	useEffect(() => {
		setInitialOpacity(0);
	}, []);

	return initialOpacity;
}

const Tag = forwardRef<
	HTMLButtonElement,
	{ tag: string } & ComponentProps<typeof motion.button>
>((props, ref) => {
	const { tag, ...rest } = props;
	const _selectedTags = useStore($selectedTags);
	const isSelected = _selectedTags.includes(tag);

	return (
		<Chip
			key={tag}
			color={isSelected || tag === "all" ? "primary" : "gray"}
			className="will-change-[opacity,transform]"
			asChild
		>
			<motion.button
				{...rest}
				className={_selectedTags.length > 1 ? styles.chip : ""}
				data-selected={isSelected}
				style={{
					// fix to distorition on animation (border-radius distorts if size animates)
					// solution is to set style inline
					borderRadius: 999,
					...rest.style,
				}}
				ref={ref}
				onClick={() => {
					if (isSelected) removeTag(tag);
					else addTag(tag);
				}}
			>
				<motion.span layout>{tag}</motion.span>
			</motion.button>
		</Chip>
	);
});
