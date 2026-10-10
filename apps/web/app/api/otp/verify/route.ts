import { handleVerifyOtp } from "@/server/auth/api";
import { runJsonPost } from "@/server/http";

// Per request, never cached. Runs in Mumbai (vercel.json), next to the database.
export const dynamic = "force-dynamic";

/** Check a login code and start a session. */
export function POST(request: Request) {
  return runJsonPost(request, handleVerifyOtp);
}
