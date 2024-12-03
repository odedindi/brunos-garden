import { z } from "zod"

const GardenLocationSchema = z.object({
  id: z.string(),
  type: z.literal("Feature"),
  properties: z.object({
    name: z.literal("gardenLocation"),
  }),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
})

export const GardenFeatureSchema = z.object({
  id: z.string(),
  type: z.literal("Feature"),
  properties: z.object({
    name: z.string().default(""),
    visible: z.boolean().default(true),
    fieldColorIndex: z.number().default(0),
    fieldColorAlpha: z.number().default(100),
  }),
  geometry: z.object({
    type: z.literal("Polygon"),
    coordinates: z.tuple([z.array(z.tuple([z.number(), z.number()]))]),
  }),
})

export const UserSchema = z.object({
  email: z.string(),
  name: z.nullable(z.string()),
  image: z.nullable(z.string()),
  gardenLocation: z.optional(GardenLocationSchema),
  gardenFeatures: z.optional(
    z.object({
      type: z.literal("FeatureCollection"),
      features: z.array(GardenFeatureSchema),
    }),
  ),
})

export type User = z.infer<typeof UserSchema>
