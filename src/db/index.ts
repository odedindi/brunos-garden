import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as userSchema from "./modules/user/schema"
import * as harvestSchema from "./modules/harvest/schema"
import * as geoFeatureSchema from "./modules/geoFeature/schema"
import { eq, type Logger as ILogger } from "drizzle-orm"
import { omit } from "lodash"

class Logger implements ILogger {
  logQuery = (query: string, params: unknown[]): void =>
    console.log({ query, params })
}

const schema = {
  ...userSchema,
  ...harvestSchema,
  ...geoFeatureSchema,
}

const sql = neon(process.env.DRIZZLE_DATABASE_URL!)
const db = drizzle(sql, { schema, logger: new Logger() })

export { db }
