import "server-only";

import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { env } from "@/env";

import type { ApiRequest, ApiResponse } from "./auth/api";
import { DEVICE_COOKIE, SESSION } from "./auth/limits";
import { ServiceUnavailableError } from "./errors";
import { log } from "./log";
import { getServices, type Services } from "./services";

const json = (status: number, body: unknown) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const error = (status: number, code: string, message: string) =>
  json(status, { error: { code, message } });

/** The caller's address as the platform reports it (Vercel sets x-forwarded-for; first entry is the client). */
function clientIp(request: Request): string {
  const first = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first ? first : "unknown";
}

/**
 * A browser must be posting from this site. Cookies are same-site=lax, and this closes the rest:
 * a cross-site form or script cannot send our JSON with a matching Origin.
 */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return (
    origin === new URL(request.url).origin || origin === new URL(env.NEXT_PUBLIC_SITE_URL).origin
  );
}

/**
 * Runs a JSON POST handler: checks the origin and content type, reads the body and cookies, applies
 * cookie changes, and turns a missing dependency into 503 and anything unexpected into a plain 500
 * (never a stack trace).
 */
export async function runJsonPost(
  request: Request,
  handler: (services: Services, input: ApiRequest) => Promise<ApiResponse>,
): Promise<Response> {
  const requestId = randomUUID();
  try {
    if (!sameOrigin(request)) return error(403, "bad_origin", "The request is not valid.");
    if (!request.headers.get("content-type")?.startsWith("application/json")) {
      return error(415, "invalid_request", "The request is not valid.");
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return error(400, "invalid_request", "The request is not valid.");
    }

    const jar = await cookies();
    const services = await getServices();
    const result = await handler(services, {
      body,
      ip: clientIp(request),
      requestId,
      cookies: {
        session: jar.get(SESSION.cookie)?.value,
        device: jar.get(DEVICE_COOKIE)?.value,
      },
    });
    for (const cookie of result.cookies ?? []) {
      jar.set(cookie.name, cookie.value, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: cookie.maxAge,
      });
    }
    return json(result.status, result.body);
  } catch (caught) {
    if (caught instanceof ServiceUnavailableError) {
      log("error", "service.unavailable", { requestId, what: caught.message });
      return error(503, "unavailable", "This is not available right now.");
    }
    log("error", "request.failed", {
      requestId,
      name: caught instanceof Error ? caught.name : "unknown",
    });
    return error(500, "server_error", "Something went wrong.");
  }
}
