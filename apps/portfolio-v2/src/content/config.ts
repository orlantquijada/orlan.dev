import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const notes = defineCollection({
	loader: glob({ base: "src/content/notes", pattern: "**/*.mdx" }),
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()),
		description: z.string().optional(),
		publishedAt: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		draft: z.boolean().default(false),
		wip: z.boolean().default(false),
	}),
});

export const collections = { notes };
