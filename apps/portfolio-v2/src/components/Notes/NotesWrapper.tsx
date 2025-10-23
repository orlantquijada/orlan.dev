import type { CollectionEntry } from "astro:content";
import { LayoutGroup } from "motion/react";

import type { TagGraphMap } from "@/lib/notes";
import NotesList from "./NotesList";
import NoteTagsList from "./NoteTagsList";

type Props = {
	tags: string[];
	tagsGraph: TagGraphMap;
	notes: Array<CollectionEntry<"notes">["data"] & { href: string }>;
};

// wrapper component necessary for layout animations
export default function NotesWrapper({ notes, tags, tagsGraph }: Props) {
	return (
		<LayoutGroup>
			<NoteTagsList tags={tags} tagsGraph={tagsGraph} />
			<NotesList className="mt-14" notes={notes} />
		</LayoutGroup>
	);
}
