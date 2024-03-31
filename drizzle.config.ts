import "dotenv/config";
import type {Config} from "drizzle-kit";
export default {
  schema: "./src/db/schema.ts",
  out: "./src/drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "database/sqlite.db"
}
} satisfies Config;