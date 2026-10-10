import "server-only";

import { randomUUID } from "node:crypto";

import { z } from "zod";

import type { Services } from "../services";

import { DEVICE_COOKIE, SESSION } from "./limits";
import { sendOtp, verifyOtp } from "./otp";
import { parseIndianMobile } from "./phone";
import { createSession, revokeSession } from "./session";

/** What a handler needs from the HTTP request, already read by the route (server/http.ts). */
export interface ApiRequest {
  body: unknown;
  ip: string;
  requestId: string;
  cookies: { session?: string | undefined; device?: string | undefined };
}

export interface CookieChange {
  name: string;
  /** Empty string with maxAge 0 clears the cookie. */
  value: string;
  maxAge: number;
}

export interface ApiResponse {
  status: number;
  body: { ok: true } | { error: { code: string; message: string } };
  cookies?: CookieChange[];
}

const fail = (status: number, code: string, message: string): ApiResponse => ({
  status,
  body: { error: { code, message } },
});

const INVALID = fail(400, "invalid_request", "The request is not valid.");
const INVALID_PHONE = fail(400, "invalid_phone", "Enter a 10-digit mobile number.");

// Strict objects: an unknown field is a rejected request (.claude/rules/server.md).
const sendBody = z.strictObject({ phone: z.string().max(32) });
const verifyBody = z.strictObject({
  phone: z.string().max(32),
  code: z.string().regex(/^\d{6}$/),
  lang: z.enum(["en", "te"]).default("en"),
});
const emptyBody = z.strictObject({});

/** POST /api/otp/send: send a login code to a phone. */
export async function handleSendOtp(services: Services, request: ApiRequest): Promise<ApiResponse> {
  const parsed = sendBody.safeParse(request.body);
  if (!parsed.success) return INVALID;
  const phone = parseIndianMobile(parsed.data.phone);
  if (!phone) return INVALID_PHONE;

  // A device id for the per-device limit; issued on the first send and kept for a year.
  const device = request.cookies.device ?? randomUUID();
  const cookies: CookieChange[] = request.cookies.device
    ? []
    : [{ name: DEVICE_COOKIE, value: device, maxAge: 365 * 24 * 60 * 60 }];

  const result = await sendOtp(services, {
    phone,
    ip: request.ip,
    device,
    requestId: request.requestId,
  });
  if (result.ok) return { status: 200, body: { ok: true }, cookies };
  switch (result.reason) {
    case "rate_limited":
      return {
        ...fail(429, "rate_limited", "Too many codes requested. Try again later."),
        cookies,
      };
    case "challenge_required":
      return {
        ...fail(429, "challenge_required", "Too many codes sent to this number. Try again later."),
        cookies,
      };
    case "daily_cap":
      return { ...fail(503, "unavailable", "Login is not available right now."), cookies };
  }
}

/** POST /api/otp/verify: check the code and, if right, log the person in. */
export async function handleVerifyOtp(
  services: Services,
  request: ApiRequest,
): Promise<ApiResponse> {
  const parsed = verifyBody.safeParse(request.body);
  if (!parsed.success) return INVALID;
  const phone = parseIndianMobile(parsed.data.phone);
  if (!phone) return INVALID_PHONE;

  const result = await verifyOtp(services, {
    phone,
    code: parsed.data.code,
    ip: request.ip,
    lang: parsed.data.lang,
    requestId: request.requestId,
  });
  if (!result.ok) {
    switch (result.reason) {
      case "wrong_code":
        return fail(400, "wrong_code", "That code didn't match.");
      case "expired":
        return fail(400, "code_expired", "That code has expired. Ask for a new one.");
      case "too_many_attempts":
        return fail(429, "too_many_attempts", "Too many wrong tries. Ask for a new code.");
      case "rate_limited":
        return fail(429, "rate_limited", "Too many tries. Try again later.");
    }
  }

  const session = await createSession(
    services.db,
    result.userId,
    services.now(),
    request.cookies.session,
  );
  return {
    status: 200,
    body: { ok: true },
    cookies: [{ name: SESSION.cookie, value: session.token, maxAge: SESSION.ttlSeconds }],
  };
}

/** POST /api/auth/logout: end the session on the server and clear the cookie. */
export async function handleLogout(services: Services, request: ApiRequest): Promise<ApiResponse> {
  if (!emptyBody.safeParse(request.body).success) return INVALID;
  await revokeSession(services.db, request.cookies.session, services.now());
  return {
    status: 200,
    body: { ok: true },
    cookies: [{ name: SESSION.cookie, value: "", maxAge: 0 }],
  };
}
