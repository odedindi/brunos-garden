import type { Config } from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

export default {
  schema: "./src/db/**/schema.ts",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    ssl: true,
  },
  verbose: true,
  strict: true,
} satisfies Config