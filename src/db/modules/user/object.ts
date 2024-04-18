import { builder, createCommonQueryArgs } from "@/db/builder"
import { User, roleEnum } from "./schema"
import { HarvestType } from "../harvest/object"
import { db } from "@/db"
import { Role } from "generated/graphql"

export const RoleEnum = builder.enumType("Role", {
  values: roleEnum.enumValues,
})

export const UserType = builder.objectRef<User>("User").implement({
  fields: (t) => ({
    id: t.int({ resolve: (root) => root.id }),
    email: t.string({ resolve: (root) => root.email }),
    name: t.string({ nullable: true, resolve: (root) => root.name }),
    image: t.string({ nullable: true, resolve: (root) => root.image }),
    createdAt: t.field({
      type: "Date",
      nullable: true,
      resolve: (root) => root.createdAt,
    }),
    updatedAt: t.field({
      type: "Date",
      nullable: true,
      resolve: (root) => root.updatedAt,
    }),
    role: t.field({
      type: RoleEnum,
      resolve: (root) => root.role ?? Role.User,
    }),
    harvests: t.field({
      type: [HarvestType],
      authScopes: { isAuthenticated: true },
      args: {
        ...createCommonQueryArgs(t.arg),
      },
      resolve: async ({ email }, { limit, offset, orderBy }, _ctx) =>
        db.query.harvests.findMany({
          where: ({ userEmail }, { eq }) => eq(userEmail, email),
          orderBy: orderBy
            ? ({ id }, opertor) => opertor[orderBy](id)
            : undefined,
          limit: limit ?? undefined,
          offset: offset ?? undefined,
        }),
    }),
  }),
})
