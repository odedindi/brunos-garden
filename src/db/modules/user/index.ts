import { db } from "@/db"
import { NewUser, User, users } from "./schema"
import { omit } from "lodash"
import { eq } from "drizzle-orm"

export * from "./schema"

export const findUser = async (email: string) =>
  db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email),
    with: {
      harvests: {
        orderBy: ({ id }, { desc }) => desc(id),
      },
    },
  })

export const insertUser = async (user: NewUser) =>
  db.insert(users).values(user).returning()

export const updateUser = async (user: User) =>
  db
    .update(users)
    .set(omit(user, ["id", "email"]))
    .where(eq(users.email, user.email))
    .returning()

export const deleteUser = async (email: string) =>
  db
    .delete(users)
    .where(eq(users.email, email))
    .returning({ deletedId: users.email })
