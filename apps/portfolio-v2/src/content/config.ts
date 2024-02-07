import { defineCollection, z } from 'astro:content'

const notes = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).transform((arg) => {
      return new Set(arg)
    }),
    description: z.string().optional(),
    publishedAt: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    draft: z.boolean().default(false),
    wip: z.boolean().default(false),
  }),
})

export const collections = { notes }
