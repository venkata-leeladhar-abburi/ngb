// Uptime check endpoint (playbook section 7: uptime checks every minute).
// Phase 7 adds database and Redis pings here.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
