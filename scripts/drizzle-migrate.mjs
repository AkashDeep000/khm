import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as dotenv from 'dotenv'

dotenv.config()

const url = process.env.MODE === "production" ? "./database/prod.sqlite" : "./database/dev.sqlite"

console.log({ url })
const client = sqlite(url, { verbose: console.log })
// use sqlite pragma. recommended from https://cj.rs/blog/sqlite-pragma-cheatsheet-for-performance-and-consistency/
client.pragma('journal_mode=WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
client.pragma('synchronous=normal')
client.pragma('foreign_keys=on')
const db = drizzle(client)
async function main() {
  console.info(`Running migrations...`)
  const migrationsFolder = './src/db/migrations'

  migrate(db, { migrationsFolder })
  console.info('Migrated successfully')

  process.exit(0)
}

main().catch((e) => {
  console.error('Migration failed')
  console.error(e)
  process.exit(1)
})