import type { CollectionEntry } from "astro:content";
import { LayoutGroup } from "motion/react";
import { useEffect, useState } from "react";

import type { TagGraphMap } from "@/lib/notes";
import NotesList from "./NotesList";
import NoteTagsList from "./NoteTagsList";

type Props = {
	notes: Array<CollectionEntry<"notes">["data"] & { href: string }>;
	tags: string[];
	tagsGraph: TagGraphMap;
};

// wrapper component necessary for layout animations
export default function NotesWrapper({ notes, tags, tagsGraph }: Props) {
	const hasMounted = useHasMounted();
	return (
		// Remount once after hydration: Motion doesn't run layout animations for
		// elements it hydrated from server HTML (only for client-rendered ones),
		// so the first chip clicks after a page load would jump instead of move.
		<LayoutGroup key={hasMounted ? "client" : "server"}>
			<NoteTagsList tags={tags} tagsGraph={tagsGraph} />
			<NotesList className="mt-14" notes={notes} />
		</LayoutGroup>
	);
}

function useHasMounted() {
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => setHasMounted(true), []);
	return hasMounted;
}
