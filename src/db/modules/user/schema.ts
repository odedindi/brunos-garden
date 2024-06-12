import { relations } from "drizzle-orm"
import {
  pgTable,
  timestamp,
  varchar,
  index,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core"
import { harvests } from "../harvest/schema"
import { geoFeatures } from "../geoFeature/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const roleEnum = pgEnum("role", ["admin", "user"])

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 100 }).notNull().unique(), // Add unique constraint
    name: varchar("name", { length: 100 }),
    image: varchar("image", { length: 500 }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
      () => new Date(),
    ),
    role: roleEnum("role").notNull().default("user"),
  },
  (users) => ({
    emailIdx: index("email_idx").on(users.email),
  }),
)

export const userRelations = relations(users, ({ many }) => ({
  harvests: many(harvests),
  gardenFeatures: many(geoFeatures),
}))

const UserSchema = createSelectSchema(users)
export type User = z.infer<typeof UserSchema> // return type when queried

const InsertUserSchema = createInsertSchema(users).required({
  email: true,
})
export type NewUser = z.infer<typeof InsertUserSchema> // insert type