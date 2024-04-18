import { builder, createCommonQueryArgs } from "@/db/builder"
import { UserType } from "./object"
import { db } from "@/db"

builder.queryFields((t) => ({
  me: t.field({
    authScopes: { isAuthenticated: true },
    type: UserType,
    nullable: true,
    resolve: async (_, _args, ctx) => ctx.user,
  }),
  getUser: t.field({
    authScopes: { isAuthenticated: true },
    type: UserType,
    nullable: true,
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (_, args, _ctx) => {
      return db.query.users.findFirst({
        where: (user, { eq }) => eq(user.email, args.email),
      })
    },
  }),
  getUsers: t.field({
    authScopes: { isAdmin: true },
    type: [UserType],
    args: { ...createCommonQueryArgs(t.arg) },
    resolve: async (_, { orderBy, offset, limit }, _ctx) =>
      db.query.users.findMany({
        orderBy: orderBy
          ? ({ id }, opertor) => opertor[orderBy](id)
          : undefined,
        limit: limit ?? undefined,
        offset: offset ?? undefined,
      }),
  }),
}))
