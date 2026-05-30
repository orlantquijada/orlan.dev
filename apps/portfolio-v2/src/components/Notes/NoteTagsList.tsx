import { useStore } from "@nanostores/react";
import { transitions } from "@repo/utils";
import {
	AnimatePresence,
	LayoutGroup,
	MotionConfig,
	motion,
} from "motion/react";
import { type ComponentProps, type Ref, useEffect, useState } from "react";
import Close from "@/icons/cross.svg?react";

import { getNeighborhoodsIntersection, type TagGraphMap } from "@/lib/notes";
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
									animate={{ opacity: 1 }}
									initial={{ opacity: 0 }}
									onClick={() => clearTags()}
								>
									<Close className={styles.icon} />
								</motion.button>
							</Chip>
						) : (
							<Chip asChild color="primary">
								<motion.span exit={{ opacity: 0 }}>all</motion.span>
							</Chip>
						)}

						{_selectedTags.map((tag, index) =>
							index === 0 ? (
								<Tag
									key={tag}
									layoutId={tag}
									style={{ zIndex: 5 - index }}
									tag={tag}
								/>
							) : (
								<Tag
									custom={index}
									key={tag}
									layoutId={tag}
									style={{
										zIndex: 5 - index,

										paddingLeft: 36,
										marginLeft: -32,
										justifyContent: "flex-end",
									}}
									tag={tag}
								/>
							)
						)}

						{isSelecting
							? visibleTags.map((tag) => (
									<Tag
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										initial={{ opacity: initialOpacity }}
										key={tag}
										layoutId={tag}
										tag={tag}
									/>
								))
							: tags.map((tag) => (
									<Tag
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										initial={{ opacity: initialOpacity }}
										key={tag}
										layoutId={tag}
										tag={tag}
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

type TagProps = { tag: string; ref?: Ref<HTMLButtonElement> } & ComponentProps<
	typeof motion.button
>;

const Tag = (props: TagProps) => {
	const { tag, ref, ...rest } = props;
	const _selectedTags = useStore($selectedTags);
	const isSelected = _selectedTags.includes(tag);

	return (
		<Chip
			asChild
			className="will-change-[opacity,transform]"
			color={isSelected || tag === "all" ? "primary" : "gray"}
			key={tag}
		>
			<motion.button
				{...rest}
				className={_selectedTags.length > 1 ? styles.chip : ""}
				data-selected={isSelected}
				onClick={() => {
					if (isSelected) {
						removeTag(tag);
					} else {
						addTag(tag);
					}
				}}
				ref={ref}
				style={{
					// fix to distorition on animation (border-radius distorts if size animates)
					// solution is to set style inline
					borderRadius: 999,
					...rest.style,
				}}
			>
				<motion.span layout>{tag}</motion.span>
			</motion.button>
		</Chip>
	);
};
