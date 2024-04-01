import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

const url = process.env.MODE === "production" ? "./database/prod.db" : "./database/dev.db"

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: { url },
  verbose: true,
} satisfies Config