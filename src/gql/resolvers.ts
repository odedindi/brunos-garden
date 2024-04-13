import { InferResolvers } from "garph"
import { YogaInitialContext } from "graphql-yoga"
import { mutationType, queryType } from "./schema"
import { db } from "@/db"
import { deleteUser, findUser, insertUser, users } from "@/db/modules/user"

type Resolvers = InferResolvers<
  { Query: typeof queryType; Mutation: typeof mutationType },
  { context: YogaInitialContext }
>

export const resolvers: Resolvers = {
  Query: {
    getUser: (_, { email }, _ctx) => findUser(email),
    getUsers: (_, __, _ctx) => db.select().from(users),
  },
  Mutation: {
    addUser: (_, user, _ctx) => insertUser(user),
    removeUser: (_, { id }, _ctx) => deleteUser(id),
  },
}
