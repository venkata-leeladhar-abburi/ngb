// Applies db/migrations to the database in DATABASE_URL. Run with `pnpm db:migrate`, from apps/web,
// before deploying code that needs the new schema. Local mode migrates itself (server/db/client.ts).
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env["DATABASE_URL"];
if (!url) {
  console.error("DATABASE_URL is not set. Nothing was migrated.");
  process.exit(1);
}

const client = postgres(url, { max: 1 });
await migrate(drizzle(client), { migrationsFolder: "db/migrations" });
await client.end();
process.stdout.write("Migrations applied.\n");
