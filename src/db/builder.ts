import SchemaBuilder from "@pothos/core"
import { Session } from "next-auth"
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects"
import { DateResolver, JSONResolver } from "graphql-scalars"

import { YogaInitialContext } from "graphql-yoga"
import { db } from "."
import { users } from "./modules/user/schema"
import { eq, desc } from "drizzle-orm"
import { omit } from "lodash"

export * as user from "./modules/user"

interface Context extends YogaInitialContext {
  session: Promise<Session | null>
}

export const builder = new SchemaBuilder<{
  Context: Context
  Scalars: {
    Date: {
      Input: Date
      Output: Date
    }
    JSON: {
      Input: unknown
      Output: unknown
    }
  }
}>({
  plugins: [SimpleObjectsPlugin],
})

builder.addScalarType("JSON", JSONResolver)
builder.addScalarType("Date", DateResolver)

const HarvestType = builder.simpleObject("HarvestObject", {
  fields: (t) => ({
    id: t.int(),
    crop: t.string(),
    date: t.string(),
    weight_g: t.int(),
    area_m2: t.string(),
    yield_Kg_m2: t.string(),
    createdAt: t.field({ type: "Date", nullable: true }),
    userEmail: t.string(),
  }),
})

const UserType = builder.simpleObject(
  "User",
  {
    fields: (t) => ({
      id: t.int(),
      email: t.string(),
      name: t.string({ nullable: true }),
      image: t.string({ nullable: true }),
      createdAt: t.field({ type: "Date", nullable: true }),
      updatedAt: t.field({ type: "Date", nullable: true }),
    }),
  },
  (t) => ({
    harvests: t.field({
      type: [HarvestType],
      resolve: async ({ email }, _args, _ctx) =>
        db.query.harvests.findMany({
          where: ({ userEmail }, { eq }) => eq(userEmail, email),
        }),
    }),
  }),
)

builder.queryType({
  fields: (t) => ({
    me: t.field({
      type: UserType,
      nullable: true,
      resolve: async (_, _args, ctx) => {
        const session = await ctx.session
        if (!session?.user?.email) throw new Error("Error: Not authenticated")
        return db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, session.user!.email!),
          with: {
            harvests: { orderBy: ({ id }, { desc }) => desc(id) },
          },
        })
      },
    }),
    getUser: t.field({
      type: UserType,
      nullable: true,
      args: {
        email: t.arg.string({ required: true }),
      },
      resolve: async (_, { email }, ctx) => {
        const session = await ctx.session
        if (!session) throw new Error("Error: Not authenticated")
        return db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, email),
        })
      },
    }),
    getUsers: t.field({
      type: [UserType],

      resolve: async (_, _args, ctx) => {
        const session = await ctx.session
        if (!session) throw new Error("Error: Not authenticated")
        return db.select().from(users).orderBy(desc(users.id))
      },
    }),
  }),
})

builder.mutationType({
  fields: (t) => ({
    addUser: t.field({
      type: [UserType],
      args: {
        email: t.arg.string({ required: true }),
        name: t.arg.string(),
        image: t.arg.string(),
      },
      resolve: async (_, args, ctx) => {
        const session = await ctx.session
        if (!session) throw new Error("Error: Not authenticated")
        return db.insert(users).values(args).returning()
      },
    }),
    updateUser: t.field({
      type: [UserType],
      args: {
        id: t.arg.int({ required: true }),
        email: t.arg.string(),
        name: t.arg.string(),
        image: t.arg.string(),
      },
      resolve: async (_, args, ctx) => {
        const session = await ctx.session
        if (!session) throw new Error("Error: Not authenticated")
        return db
          .update(users)
          .set(omit(args, ["id", "email"]))
          .where(eq(users.id, args.id))
          .returning()
      },
    }),

    removeUser: t.field({
      type: [UserType],
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (_, { id }, ctx) => {
        const session = await ctx.session
        if (!session) throw new Error("Error: Not authenticated")
        return db.delete(users).where(eq(users.id, id)).returning()
      },
    }),
  }),
})
