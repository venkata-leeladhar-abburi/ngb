import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isProduction = process.env["VERCEL_ENV"] === "production";

/**
 * Every environment variable the app reads, validated once.
 * Import `env` from here; never read `process.env` directly elsewhere.
 */
export const env = createEnv({
  server: {
    // Postgres in Mumbai (pooled). Without it the app runs only in local mode (server/services.ts).
    DATABASE_URL: z.url().optional(),
    // Keys the OTP hashes. At least 32 random characters; rotate it to cancel every pending code.
    AUTH_SECRET: isProduction ? z.string().min(32) : z.string().min(32).optional(),
    // "1" swaps Postgres, Redis and SMS for local stand-ins. Ignored on Vercel (see VERCEL).
    NGB_LOCAL_SERVICES: z.enum(["1"]).optional(),
    // Set by Vercel on every deployment; local stand-ins never run there.
    VERCEL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: isProduction ? z.url() : z.url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    DATABASE_URL: process.env["DATABASE_URL"],
    AUTH_SECRET: process.env["AUTH_SECRET"],
    NGB_LOCAL_SERVICES: process.env["NGB_LOCAL_SERVICES"],
    VERCEL: process.env["VERCEL"],
    NEXT_PUBLIC_SITE_URL: process.env["NEXT_PUBLIC_SITE_URL"],
  },
  emptyStringAsUndefined: true,
});
