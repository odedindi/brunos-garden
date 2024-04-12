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
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
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

export const HarvestSchema = createSelectSchema(harvests)
export type Harvest = z.infer<typeof HarvestSchema> // return type when queried
export const InsertHarvestSchema = createInsertSchema(harvests)

export type NewHarvest = z.infer<typeof InsertHarvestSchema> // insert type

export const CreateHarvestRequestBodySchema = InsertHarvestSchema.omit({
  id: true,
  userEmail: true,
  createdAt: true,
}).required({
  crop: true,
  date: true,
  weight_g: true,
  area_m2: true,
  yield_Kg_m2: true,
})

export type CreateHarvestRequestBody = z.infer<
  typeof CreateHarvestRequestBodySchema
>

export const UpdateHarvestRequestBodySchema = InsertHarvestSchema.omit({
  createdAt: true,
})
  .required({ id: true, userEmail: true })
  .extend({
    crop: z.string().optional(),
    date: z.string().optional(),
    weight_g: z.number().optional(),
    area_m2: z.number().optional(),
    yield_Kg_m2: z.number().optional(),
  })
  .transform((harvest) => ({
    ...harvest,
    area_m2: harvest.area_m2 ? harvest.area_m2.toString() : undefined,
    yield_Kg_m2:
      harvest.area_m2 && harvest.weight_g
        ? (harvest.weight_g / 1000 / harvest.area_m2).toString()
        : undefined,
  }))

export type UpdateHarvestRequestBody = z.infer<
  typeof UpdateHarvestRequestBodySchema
>
