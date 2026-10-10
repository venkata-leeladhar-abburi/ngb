import "server-only";

import { and, eq } from "drizzle-orm";

import { programs } from "@/db/schema";

import { SESSION } from "./auth/limits";
import { maskPhone } from "./auth/phone";
import { getSessionUser } from "./auth/session";
import { ServiceUnavailableError } from "./errors";
import { describeError, log } from "./log";
import { getServices, localServicesAllowed } from "./services";

export type CheckoutView =
  | {
      state: "ready";
      program: { name: string; weeks: number; pricePaise: number };
      signedInPhone: string | null;
    }
  | { state: "not_found" }
  | { state: "unavailable" };

/**
 * What the checkout page needs: the program and its price from the database (the browser is never
 * asked what something costs) and, if the visitor is logged in, their phone, masked.
 */
export async function loadCheckout(
  slug: string,
  sessionToken: string | undefined,
): Promise<CheckoutView> {
  try {
    const { db, now } = await getServices();
    const [program] = await db
      .select({ name: programs.name, weeks: programs.weeks, pricePaise: programs.pricePaise })
      .from(programs)
      .where(and(eq(programs.slug, slug), eq(programs.active, true)))
      .limit(1);
    if (!program) return { state: "not_found" };
    const user = await getSessionUser(db, sessionToken, now());
    return { state: "ready", program, signedInPhone: user ? maskPhone(user.phone) : null };
  } catch (caught) {
    if (!(caught instanceof ServiceUnavailableError)) {
      log("error", "checkout.load_failed", describeError(caught, localServicesAllowed()));
    }
    return { state: "unavailable" };
  }
}

export { SESSION };
