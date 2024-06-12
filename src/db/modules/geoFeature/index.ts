import { db } from "@/db"
import { NewGeoFeatures, GeoFeatures, geoFeatures } from "./schema"
import { omit } from "lodash"
import { eq } from "drizzle-orm"

export * from "./schema"

export const insertGeoFeature = async (feature: NewGeoFeatures) =>
  db.insert(geoFeatures).values(feature).returning()

export const updateGeoFeature = async (user: GeoFeatures) =>
  db
    .update(geoFeatures)
    .set(omit(user, ["id"]))
    .where(eq(geoFeatures.id, user.id))
    .returning()

export const deleteGeoFeature = async (id: string) =>
  db
    .delete(geoFeatures)
    .where(eq(geoFeatures.id, id))
    .returning({ deletedId: geoFeatures.id })
