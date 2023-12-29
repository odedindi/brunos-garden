import { z } from "zod"

export const HarvestSchema = z.object({
  id: z.string(),
  crop: z.string(),
  date: z.string(),
  weight: z.string(),
  area: z.string(),
  harvest: z.string().optional(), // weight-to-area ratio of the crop
})

export type Harvest = z.infer<typeof HarvestSchema>
