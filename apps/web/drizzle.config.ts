import { defineConfig } from "drizzle-kit";

// `pnpm db:generate` only reads the schema and writes SQL; it never connects to a database.
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  casing: "snake_case",
});
