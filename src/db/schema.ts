import { writeFileSync } from "fs"
import { printSchema, lexicographicSortSchema } from "graphql"

import { builder } from "./builder"

export const schema = builder.toSchema()
const schemaAsString = printSchema(lexicographicSortSchema(schema))
writeFileSync("./schema.graphql", schemaAsString)
