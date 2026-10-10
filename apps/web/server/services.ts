import "server-only";

import { env } from "@/env";

import { connectLocal, type Db } from "./db/client";
import { seedPrograms } from "./db/seed";
import { ServiceUnavailableError } from "./errors";
import { MemoryRateLimiter, type RateLimiter } from "./rateLimit";
import { OutboxSmsSender, type SmsSender } from "./sms";

/** Everything server code needs from outside this process, so tests and local runs can swap it. */
export interface Services {
  db: Db;
  limiter: RateLimiter;
  sms: SmsSender;
  /** Keys the OTP hashes. */
  secret: string;
  now: () => Date;
}

/** Local stand-in data: the in-process database and the SMS outbox (git-ignored). */
export const LOCAL_DATA_DIR = ".data";
export const LOCAL_SMS_OUTBOX = `${LOCAL_DATA_DIR}/sms-outbox.jsonl`;

// Local runs only: a fixed key so codes survive a dev-server restart. Never used on a deployment.
const LOCAL_SECRET = "local-development-secret-not-for-any-deployment";

/**
 * Local stand-ins (in-process Postgres, in-memory limits, SMS outbox) are allowed only when asked
 * for explicitly and never on Vercel. `pnpm dev` and the Playwright server set the flag.
 */
export const localServicesAllowed = (): boolean =>
  env.NGB_LOCAL_SERVICES === "1" && env.VERCEL === undefined;

async function create(): Promise<Services> {
  const now = () => new Date();

  if (localServicesAllowed() && !env.DATABASE_URL) {
    const db = await connectLocal(`${LOCAL_DATA_DIR}/pglite`);
    await seedPrograms(db);
    return {
      db,
      limiter: new MemoryRateLimiter(now),
      sms: new OutboxSmsSender(LOCAL_SMS_OUTBOX),
      secret: env.AUTH_SECRET ?? LOCAL_SECRET,
      now,
    };
  }

  // A real deployment. Redis and the SMS provider are wired in when their accounts exist; until
  // then login fails closed here rather than fall back to a stand-in.
  if (!env.DATABASE_URL) throw new ServiceUnavailableError("The database");
  if (!env.AUTH_SECRET) throw new ServiceUnavailableError("The auth secret");
  throw new ServiceUnavailableError("The rate limiter and SMS provider");
}

// One set per server process, kept across dev hot reloads.
const holder = globalThis as typeof globalThis & { ngbServices?: Promise<Services> };

/** The services for this process. Throws ServiceUnavailableError when a dependency is missing. */
export function getServices(): Promise<Services> {
  holder.ngbServices ??= create().catch((error: unknown) => {
    // Do not cache a failure: the next request tries again.
    delete holder.ngbServices;
    throw error;
  });
  return holder.ngbServices;
}
