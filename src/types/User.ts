import { z } from "zod"

export const UserSchema = z.object({
  email: z.string(),
  name: z.nullable(z.string()),
  image: z.nullable(z.string()),
  gardenLocation: z.optional(
    z.object({
      id: z.string(),
      type: z.literal("Feature"),
      properties: z.object({ name: z.literal("gardenLocation") }),
      geometry: z.object({
        type: z.literal("Point"),
        coordinates: z.tuple([z.number(), z.number()]),
      }),
    }),
  ),
})

export type User = z.infer<typeof UserSchema>
