import {
  varchar,
  pgTable,
  timestamp,
  index,
  pgEnum,
  json,
} from "drizzle-orm/pg-core"
import { users } from "../user/schema"
import { relations } from "drizzle-orm"

export const featureTypeEnum = pgEnum("featureType", [
  "FeatureCollection",
  "Feature",
  "Point",
  "Polygon",
])

export const geoFeatures = pgTable(
  "geoFeatures",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    type: featureTypeEnum("type").notNull(),
    properties: json("properties").default({ name: "" }),
    geometry: json("geometry").default({}),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    userEmail: varchar("user_email")
      .notNull()
      .references(() => users.email),
  },
  (geoFeatures) => ({
    typeIdx: index("type_idx").on(geoFeatures.type),
    userIdx: index("geoFeatures_user_idx").on(geoFeatures.userEmail),
  }),
)

export const gardenFeatuesRelations = relations(geoFeatures, ({ one }) => ({
  user: one(users, {
    fields: [geoFeatures.userEmail],
    references: [users.email],
  }),
}))

export type GeoFeatures = typeof geoFeatures.$inferSelect // return type when queried
export type NewGeoFeatures = typeof geoFeatures.$inferInsert // insert type
