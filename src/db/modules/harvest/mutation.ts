import { builder } from "@/db/builder"
import { HarvestType } from "./object"
import { harvests } from "./schema"
import { db } from "@/db"
import { eq, and, inArray } from "drizzle-orm"

const AddHarvestInput = builder.inputType("AddHarvestInput", {
  fields: (t) => ({
    crop: t.string({ required: true }),
    date: t.string({ required: true }),
    weight_g: t.int({ required: true }),
    area_m2: t.string({ required: true }),
    yield_Kg_m2: t.string({ required: true }),
  }),
})

const UpdateHarvestInput = builder.inputType("UpdateHarvestInput", {
  fields: (t) => ({
    id: t.int({ required: true }),
    crop: t.string(),
    date: t.string(),
    weight_g: t.int(),
    area_m2: t.string(),
    yield_Kg_m2: t.string(),
  }),
})

builder.mutationFields((t) => ({
  addHarvest: t.field({
    authScopes: { isAuthenticated: true },
    type: HarvestType,
    args: {
      harvest: t.arg({ type: AddHarvestInput, required: true }),
    },
    resolve: async (_, { harvest }, { user }) => {
      if (!user) throw new Error("Error: user not found")
      const [newHarvest] = await db
        .insert(harvests)
        .values({ ...harvest, userEmail: user.email })
        .returning()

      return newHarvest
    },
  }),
  updateHarvest: t.field({
    authScopes: { isAuthenticated: true },
    type: HarvestType,
    args: {
      harvest: t.arg({ type: UpdateHarvestInput, required: true }),
    },
    resolve: async (
      _,
      { harvest: { id, crop, date, weight_g, area_m2, yield_Kg_m2 } },
      { user, isAdmin },
    ) => {
      if (!user) throw new Error("Error: user not found")
      const [updatedHarvest] = await db
        .update(harvests)
        .set({
          crop: crop ?? undefined,
          date: date ?? undefined,
          weight_g: weight_g ?? undefined,
          area_m2: area_m2 ?? undefined,
          yield_Kg_m2: yield_Kg_m2 ?? undefined,
        })
        .where(
          isAdmin
            ? eq(harvests.id, id)
            : and(eq(harvests.id, id), eq(harvests.userEmail, user.email)),
        )
        .returning()

      return updatedHarvest
    },
  }),
  deleteHarvests: t.field({
    authScopes: { isAuthenticated: true },
    type: [HarvestType],
    args: { ids: t.arg.intList({ required: true }) },
    resolve: async (_, { ids }, { user, isAdmin }) => {
      if (!user) throw new Error("Error: user not found")
      const deletedHarvests = await db
        .delete(harvests)
        .where(
          isAdmin
            ? inArray(harvests.id, ids)
            : and(
                inArray(harvests.id, ids),
                eq(harvests.userEmail, user.email),
              ),
        )
        .returning()

      return deletedHarvests
    },
  }),
}))
