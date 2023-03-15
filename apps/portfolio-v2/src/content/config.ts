import { defineCollection, z } from 'astro:content'

const notes = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    description: z.string().optional(),
    publishedAt: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
  }),
})

export const collections = { notes }
