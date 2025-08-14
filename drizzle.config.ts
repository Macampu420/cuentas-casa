import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/**/models/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  migrations: {
    schema: "public",
    table: "__drizzle_migrations",
  },
  strict: true,
  verbose: true,
} satisfies Config;
