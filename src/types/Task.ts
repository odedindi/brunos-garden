import { z } from "zod"

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  weight: z.string(),
  area: z.string().optional(),
})

export type Task = z.infer<typeof TaskSchema>
