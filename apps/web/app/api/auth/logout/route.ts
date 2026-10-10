import { handleLogout } from "@/server/auth/api";
import { runJsonPost } from "@/server/http";

// Per request, never cached. Runs in Mumbai (vercel.json), next to the database.
export const dynamic = "force-dynamic";

/** End the session. */
export function POST(request: Request) {
  return runJsonPost(request, handleLogout);
}
