import { db } from "@/db"
import { NewUser, users } from "./schema"

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
