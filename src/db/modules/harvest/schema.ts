import {
  varchar,
  pgTable,
  timestamp,
  date,
  serial,
  index,
  decimal,
  integer,
} from "drizzle-orm/pg-core"
import { users } from "../user/schema"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const harvests = pgTable(
  "harvests",
  {
    id: serial("id").notNull().primaryKey(),
    crop: varchar("crop", { length: 256 }).notNull(),
    date: date("date", { mode: "string" }).notNull(),
    weight_g: integer("weight_g").notNull(),
    area_m2: decimal("area_m2", { precision: 10, scale: 3 }).notNull(),
    yield_Kg_m2: decimal("yield_Kg_m2", { precision: 10, scale: 3 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
    userEmail: varchar("user_email")
      .notNull()
      .references(() => users.email),
  },

  (harvests) => ({
    cropIdx: index("crop_idx").on(harvests.crop),
    userIdx: index("harvests_user_idx").on(harvests.userEmail),
  }),
)

export const harvestsRelations = relations(harvests, ({ one }) => ({
  user: one(users, {
    fields: [harvests.userEmail],
    references: [users.email],
  }),
}))

const HarvestSchema = createSelectSchema(harvests).required({
  userEmail: true,
})
export type Harvest = z.infer<typeof HarvestSchema> // return type when queried
const InsertHarvestSchema = createInsertSchema(harvests)

export type NewHarvest = z.infer<typeof InsertHarvestSchema> // insert type
