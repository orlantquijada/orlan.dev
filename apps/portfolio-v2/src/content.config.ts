import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const notes = defineCollection({
	loader: glob({ base: "src/content/notes", pattern: "**/*.mdx" }),
	schema: z.object({
		description: z.string().optional(),
		draft: z.boolean().default(false),
		publishedAt: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		tags: z.array(z.string()),
		title: z.string(),
		updatedAt: z.array(z.date()).or(z.date()).optional(),
		wip: z.boolean().default(false),
	}),
});

export const collections = { notes };
