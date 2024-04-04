import { z } from "zod"

export const HarvestSchema = z.object({
  id: z.string(),
  crop: z.string({ description: "name of the crop" }),
  date: z.string({ description: "date of harvest" }),
  weight_g: z.number({ description: "weight of the crop; g / Kg" }),
  area_m2: z.number({ description: "area of harvest; m2" }),
  yield_Kg_m2: z.number({
    description: "weight-to-area ratio of the crop; Kg/m2",
  }),
})

export type Harvest = z.infer<typeof HarvestSchema>
