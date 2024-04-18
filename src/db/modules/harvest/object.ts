import { builder } from "@/db/builder"
import { Harvest } from "./schema"

export const HarvestType = builder.objectRef<Harvest>("Harvest").implement({
  fields: (t) => ({
    id: t.int({ resolve: (root) => root.id }),
    crop: t.string({ resolve: (root) => root.crop }),
    date: t.string({ resolve: (root) => root.date }),
    weight_g: t.int({ resolve: (root) => root.weight_g }),
    area_m2: t.string({ resolve: (root) => root.area_m2 }),
    yield_Kg_m2: t.string({ resolve: (root) => root.yield_Kg_m2 }),
    createdAt: t.field({ type: "Date", resolve: (root) => root.createdAt }),
    updatedAt: t.field({ type: "Date", resolve: (root) => root.updatedAt }),
    userEmail: t.string({ resolve: (root) => root.userEmail }),
  }),
})
