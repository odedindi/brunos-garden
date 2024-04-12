import { db } from "@/db"
import { NewHarvest, harvests, UpdateHarvestRequestBody } from "./schema"
import { eq, and, inArray } from "drizzle-orm"

export * from "./schema"

export const insertHarvest = async (harvest: NewHarvest) =>
  db.insert(harvests).values(harvest).returning()

export const updateharvest = async (harvest: UpdateHarvestRequestBody) =>
  db
    .update(harvests)
    .set(harvest)
    .where(
      and(
        eq(harvests.id, harvest.id!),
        eq(harvests.userEmail, harvest.userEmail),
      ),
    )
    .returning()

export const deleteHarvests = async (userEmail: string, harvestIds: number[]) =>
  db
    .delete(harvests)
    .where(
      and(eq(harvests.userEmail, userEmail), inArray(harvests.id, harvestIds)),
    )
    .returning({ deletedId: harvests.id, userEmail: harvests.userEmail })
