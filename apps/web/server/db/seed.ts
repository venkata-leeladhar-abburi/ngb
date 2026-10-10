import "server-only";

import { programs as catalog } from "@/content/catalog";
import { programs } from "@/db/schema";

import type { Db } from "./client";

/**
 * Puts the catalog's programs into the database if they are not there yet, with prices in paise.
 * Existing rows are left alone: once a program is in the database, the database is the price of record.
 */
export async function seedPrograms(db: Db): Promise<void> {
  await db
    .insert(programs)
    .values(
      catalog.map((program) => ({
        slug: program.slug,
        name: program.name,
        weeks: program.weeks,
        pricePaise: program.priceInr * 100,
      })),
    )
    .onConflictDoNothing({ target: programs.slug });
}
