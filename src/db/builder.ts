import SchemaBuilder, { ArgBuilder } from "@pothos/core"
import { Session } from "next-auth"
import ScopeAuthPlugin from "@pothos/plugin-scope-auth"
import { DateResolver, JSONResolver } from "graphql-scalars"

import { YogaInitialContext } from "graphql-yoga"
import { User } from "./modules/user/schema"

interface Context extends YogaInitialContext {
  session: Session | null
  user?: User
  isAdmin: boolean
}

interface Schema {
  Context: Context
  AuthScopes: {
    isPublic: boolean
    isAuthenticated: boolean
    isAdmin: boolean
  }
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
}

export const builder = new SchemaBuilder<Schema>({
  plugins: [ScopeAuthPlugin],
  authScopes: ({ session, isAdmin }) => ({
    isPublic: true,
    isAuthenticated: !!session?.user?.email,
    isAdmin,
  }),
})

builder.addScalarType("JSON", JSONResolver)
builder.addScalarType("Date", DateResolver)

builder.queryType()
builder.mutationType()

export const OrderByEnum = builder.enumType("OrderBy", {
  values: ["asc", "desc"] as const,
})

export const createCommonQueryArgs = (
  arg: ArgBuilder<PothosSchemaTypes.ExtendDefaultTypes<Schema>>,
) => ({
  orderBy: arg({ type: OrderByEnum }),
  offset: arg.int(),
  limit: arg.int(),
})
