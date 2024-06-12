import { writeFileSync } from "fs"
import { printSchema, lexicographicSortSchema } from "graphql"

import { builder } from "./builder"

import "./modules/user"
import "./modules/harvest"

export const schema = builder.toSchema()
const schemaAsString = printSchema(lexicographicSortSchema(schema))
writeFileSync("./schema.graphql", schemaAsString)
