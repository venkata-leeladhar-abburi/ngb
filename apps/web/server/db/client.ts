import "server-only";

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import * as schema from "@/db/schema";

/** The database, whichever driver is behind it (postgres-js in production, PGlite locally). */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/** Matches drizzle.config.ts: camelCase in code, snake_case columns. */
export const DB_CONFIG = { schema, casing: "snake_case" } as const;

/** Where the generated SQL lives, relative to the app directory the server starts in. */
export const MIGRATIONS_FOLDER = "db/migrations";

/** Production database: a pooled postgres-js client. Migrations are applied by `pnpm db:migrate`, never at request time. */
export async function connectPostgres(url: string): Promise<Db> {
  const [{ drizzle }, { default: postgres }] = await Promise.all([
    import("drizzle-orm/postgres-js"),
    import("postgres"),
  ]);
  // Serverless functions each hold a small pool; the provider's pooler fans them in.
  return drizzle(postgres(url, { max: 5, prepare: false }), DB_CONFIG);
}

/**
 * Local stand-in: Postgres compiled to run in this process (PGlite). `dataDir` keeps data between
 * restarts; leave it out for a throwaway in-memory database (tests). Applies the same migrations.
 */
export async function connectLocal(dataDir?: string): Promise<Db> {
  const [{ PGlite }, { drizzle }, { migrate }] = await Promise.all([
    import("@electric-sql/pglite"),
    import("drizzle-orm/pglite"),
    import("drizzle-orm/pglite/migrator"),
  ]);
  // PGlite does not create missing parent folders; a first run has no .data/ yet.
  if (dataDir) {
    const { mkdir } = await import("node:fs/promises");
    await mkdir(dataDir, { recursive: true });
  }
  const db = drizzle(new PGlite(dataDir), DB_CONFIG);
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  return db;
}
