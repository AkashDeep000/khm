import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';;
import * as schema from "./schema"
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

const sqlite = new Database('database/sqlite.db');
const db = drizzle(sqlite, {schema});

export default db;
export const luciaAdapter = new DrizzleSQLiteAdapter(db, schema.sessionTable, schema.userTable);
export * from "./schema"
