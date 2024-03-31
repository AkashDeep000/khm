import { drizzle } from 'drizzle-orm/better-sqlite3';
import sqlite from 'better-sqlite3'
import * as schema from "./schema"
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

const url = process.env.MODE === "production" ? "./database/prod.sqlite" : "./database/dev.sqlite"

console.log(`ahoy!! using ${url}`)

const client = sqlite(url)
// use sqlite pragma. recommended from https://cj.rs/blog/sqlite-pragma-cheatsheet-for-performance-and-consistency/
client.pragma('journal_mode=WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
client.pragma('synchronous=normal')
client.pragma('foreign_keys=on')
const db = drizzle(client, {schema});

export default db;
export const luciaAdapter = new DrizzleSQLiteAdapter(db, schema.sessionTable, schema.userTable);
export * from "./schema"
