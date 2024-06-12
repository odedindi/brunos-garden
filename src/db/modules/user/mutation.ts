import { builder } from "@/db/builder"
import { UserType } from "./object"
import { db } from "@/db"
import { users } from "./schema"
import { omit } from "lodash"
import { eq } from "drizzle-orm"

const AddUserInput = builder.inputType("AddUserInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
    name: t.string(),
    image: t.string(),
  }),
})

builder.mutationFields((t) => ({
  addUser: t.field({
    type: UserType,
    authScopes: { isAuthenticated: true },
    args: { user: t.arg({ type: AddUserInput, required: true }) },
    resolve: async (_, { user }, _ctx) => {
      const [newUser] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning()
      return newUser
    },
  }),
  updateUser: t.field({
    authScopes: { isAuthenticated: true },
    type: UserType,
    args: {
      id: t.arg.int({ required: true }),
      email: t.arg.string(),
      name: t.arg.string(),
      image: t.arg.string(),
    },
    resolve: async (_, args, { user, isAdmin }) => {
      if (!isAdmin && user?.id !== args.id)
        throw new Error("Error: Not autherized")
      const [updatedUser] = await db
        .update(users)
        .set(omit(args, ["id", "email"]))
        .where(eq(users.id, args.id))
        .returning()
      return updatedUser
    },
  }),

  removeUser: t.field({
    authScopes: { isAuthenticated: true },
    type: UserType,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_, { id }, { user, isAdmin }) => {
      if (!isAdmin && user?.id !== id) throw new Error("Error: Not autherized")
      const [removedUser] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning()
      return removedUser
    },
  }),
}))
