import { z } from "zod"

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  schedule: z.nullable(z.string()).optional(),
  category: z.nullable(z.string()),
  completed: z.boolean(),
  tags: z.array(z.string()),
  attributes: z.array(z.string()),
})

export type Task = z.infer<typeof TaskSchema>
