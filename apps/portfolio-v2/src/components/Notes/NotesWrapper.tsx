import type { CollectionEntry } from "astro:content";
import { useStore } from "@nanostores/react";
import { transitions } from "@repo/utils";
import { LayoutGroup, MotionConfig } from "motion/react";

import { useHasMounted } from "@/hooks/useHasMounted";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { TagGraphMap } from "@/lib/notes";
import { $tagAnimationsEnabled } from "@/stores/notes";
import NotesList from "./NotesList";
import NoteTagsList from "./NoteTagsList";

type Props = {
	notes: Array<CollectionEntry<"notes">["data"] & { href: string }>;
	tags: string[];
	tagsGraph: TagGraphMap;
};

const INSTANT = { duration: 0 };

// wrapper component necessary for layout animations
export default function NotesWrapper({ notes, tags, tagsGraph }: Props) {
	const hasMounted = useHasMounted();
	const shouldReduceMotion = useReducedMotion();
	const animationsEnabled = useStore($tagAnimationsEnabled);

	return (
		<MotionConfig
			reducedMotion={shouldReduceMotion ? "always" : "never"}
			transition={animationsEnabled ? transitions.snappy : INSTANT}
		>
			{/* Remount once after hydration: Motion doesn't run layout animations
			    for elements it hydrated from server HTML, so the first chip clicks
			    after a page load would jump instead of slide. */}
			<LayoutGroup key={hasMounted ? "client" : "server"}>
				<NoteTagsList tags={tags} tagsGraph={tagsGraph} />
				<NotesList className="mt-14" notes={notes} />
			</LayoutGroup>
		</MotionConfig>
	);
}
