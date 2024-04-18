import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as userSchema from "./modules/user/schema"
import * as harvestSchema from "./modules/harvest/schema"
import * as geoFeatureSchema from "./modules/geoFeature/schema"
import { type Logger as ILogger } from "drizzle-orm"

class Logger implements ILogger {
  logQuery = (query: string, params: unknown[]): void =>
    console.log({ query, params })
}

const sql = neon(process.env.DRIZZLE_DATABASE_URL!)
const db = drizzle(sql, {
  schema: {
    ...userSchema,
    ...harvestSchema,
    ...geoFeatureSchema,
  },
  logger: new Logger(),
})

export { db }
