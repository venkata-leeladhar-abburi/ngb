import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isProduction = process.env["VERCEL_ENV"] === "production";

/**
 * Every environment variable the app reads, validated once.
 * Import `env` from here; never read `process.env` directly elsewhere.
 */
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_SITE_URL: isProduction ? z.url() : z.url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env["NEXT_PUBLIC_SITE_URL"],
  },
  emptyStringAsUndefined: true,
});
