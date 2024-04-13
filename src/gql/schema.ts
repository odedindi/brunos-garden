import { GarphSchema } from "garph"

export const g = new GarphSchema()
const dateScalar = g.scalarType<Date | null, string | null>("Date", {
  serialize: (value) => (value ? new Date(value).toISOString() : null),
  parseValue: (value) => (value ? new Date(value) : null),
})

export const UserGQL = g.type("User", {
  id: g.int(),
  email: g.string(),
  name: g.string().optional(),
  image: g.string().optional(),
  createdAt: g.ref(dateScalar),
  updatedAt: g.ref(dateScalar),
})

export const queryType = g.type("Query", {
  getUsers: g.ref(UserGQL).list().description("Gets an array of users"),
  getUser: g
    .ref(UserGQL)
    .optional()
    .args({ email: g.string() })
    .description("Gets a user"),
})

export const mutationType = g.type("Mutation", {
  addUser: g
    .ref(UserGQL)
    .list()
    .args({
      email: g.string(),
      name: g.string().optional(),
    })
    .description("Adds a new user"),

  removeUser: g
    .ref(UserGQL)
    .list()
    .optional()
    .args({ id: g.int() })
    .description("Removes an existing user"),
})
