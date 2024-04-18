import { builder, createCommonQueryArgs } from "@/db/builder"
import { HarvestType } from "./object"
import { db } from "@/db"

builder.queryFields((t) => ({
  harvest: t.field({
    authScopes: { isAuthenticated: true },
    type: HarvestType,
    nullable: true,
    args: { id: t.arg.int({ required: true }) },

    resolve: async (_, { id }, ctx) => {
      const harvest = await db.query.harvests.findFirst({
        where: (harvest, operators) => operators.eq(harvest.id, id),
      })
      return harvest
    },
  }),

  harvests: t.field({
    authScopes: { isAuthenticated: true },
    type: [HarvestType],
    args: { ...createCommonQueryArgs(t.arg) },
    resolve: async (_, { orderBy, offset, limit }, { user }) =>
      db.query.harvests.findMany({
        where: (harvest, operators) =>
          operators.eq(harvest.userEmail, user!.email),
        orderBy: orderBy
          ? ({ id }, opertor) => opertor[orderBy](id)
          : undefined,
        limit: limit ?? undefined,
        offset: offset ?? undefined,
      }),
  }),
}))
