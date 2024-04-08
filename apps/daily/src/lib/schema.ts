import { z } from 'zod'

export const reminderSchema = z.object({
  actionItem: z.string(),
  quote: z.object({
    body: z.string(),
    author: z.string(),
  }),
  description: z.string(),
})

export type Reminder = z.infer<typeof reminderSchema>

const stringToJSONSchema = z.string().transform((str, ctx) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
    return z.NEVER
  }
})

export const promptSchema = stringToJSONSchema.pipe(z.array(reminderSchema))
