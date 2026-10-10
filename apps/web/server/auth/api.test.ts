import { beforeEach, describe, expect, it } from "vitest";

import { testServices } from "../testing/services";

import { handleLogout, handleSendOtp, handleVerifyOtp, type ApiRequest } from "./api";
import { DEVICE_COOKIE, SESSION } from "./limits";
import { getSessionUser } from "./session";

const PHONE = "+919876543210";
const request = (body: unknown, cookies: ApiRequest["cookies"] = {}): ApiRequest => ({
  body,
  ip: "203.0.113.7",
  requestId: "req",
  cookies,
});

let ctx: Awaited<ReturnType<typeof testServices>>;
beforeEach(async () => {
  ctx = await testServices();
});

describe("POST /api/otp/send", () => {
  it("sends a code and issues a device cookie on the first send", async () => {
    const response = await handleSendOtp(ctx.services, request({ phone: "98765 43210" }));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(response.cookies?.map((cookie) => cookie.name)).toEqual([DEVICE_COOKIE]);
    expect(ctx.sms.sent).toEqual([{ phone: PHONE, code: expect.any(String) as string }]);
  });

  it("keeps an existing device cookie", async () => {
    const response = await handleSendOtp(
      ctx.services,
      request({ phone: PHONE }, { device: "known-device" }),
    );

    expect(response.cookies).toEqual([]);
  });

  it("rejects a missing phone, a wrong type and an unknown field", async () => {
    for (const body of [{}, { phone: 9876543210 }, { phone: PHONE, admin: true }, null, "x"]) {
      const response = await handleSendOtp(ctx.services, request(body));
      expect(response.status, JSON.stringify(body)).toBe(400);
      expect(response.body).toEqual({
        error: { code: "invalid_request", message: expect.any(String) as string },
      });
    }
    expect(ctx.sms.sent).toHaveLength(0);
  });

  it("names an invalid phone number", async () => {
    const response = await handleSendOtp(ctx.services, request({ phone: "12345" }));

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: { code: "invalid_phone", message: "Enter a 10-digit mobile number." },
    });
  });

  it("answers 429 challenge_required on the fourth send", async () => {
    const device = { device: "d" };
    for (let i = 0; i < 3; i += 1) {
      await handleSendOtp(ctx.services, request({ phone: PHONE }, device));
    }
    const response = await handleSendOtp(ctx.services, request({ phone: PHONE }, device));

    expect(response.status).toBe(429);
    expect(response.body).toMatchObject({ error: { code: "challenge_required" } });
  });
});

describe("POST /api/otp/verify", () => {
  it("logs in with the right code: a session cookie that finds the user", async () => {
    await handleSendOtp(ctx.services, request({ phone: PHONE }));
    const response = await handleVerifyOtp(
      ctx.services,
      request({ phone: PHONE, code: ctx.sms.lastCode(PHONE) }),
    );

    expect(response.status).toBe(200);
    const [cookie] = response.cookies ?? [];
    expect(cookie).toMatchObject({ name: SESSION.cookie, maxAge: SESSION.ttlSeconds });
    const user = await getSessionUser(ctx.services.db, cookie?.value, ctx.services.now());
    expect(user?.phone).toBe(PHONE);
  });

  it("rotates: logging in again ends the browser's previous session", async () => {
    await handleSendOtp(ctx.services, request({ phone: PHONE }));
    const first = await handleVerifyOtp(
      ctx.services,
      request({ phone: PHONE, code: ctx.sms.lastCode(PHONE) }),
    );
    const old = first.cookies?.[0]?.value;
    await handleSendOtp(ctx.services, request({ phone: PHONE }));
    await handleVerifyOtp(
      ctx.services,
      request({ phone: PHONE, code: ctx.sms.lastCode(PHONE) }, { session: old }),
    );

    expect(await getSessionUser(ctx.services.db, old, ctx.services.now())).toBeNull();
  });

  it("answers 400 wrong_code and sets no cookie", async () => {
    await handleSendOtp(ctx.services, request({ phone: PHONE }));
    const code = ctx.sms.lastCode(PHONE) === "000000" ? "000001" : "000000";
    const response = await handleVerifyOtp(ctx.services, request({ phone: PHONE, code }));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: { code: "wrong_code" } });
    expect(response.cookies).toBeUndefined();
  });

  it("rejects codes that are not six digits and unknown fields", async () => {
    for (const body of [
      { phone: PHONE, code: "12345" },
      { phone: PHONE, code: "abcdef" },
      { phone: PHONE, code: 123456 },
      { phone: PHONE, code: "123456", lang: "fr" },
      { phone: PHONE, code: "123456", userId: "someone-else" },
    ]) {
      const response = await handleVerifyOtp(ctx.services, request(body));
      expect(response.status, JSON.stringify(body)).toBe(400);
      expect(response.body).toMatchObject({ error: { code: "invalid_request" } });
    }
  });

  it("answers 400 code_expired when there is no live code", async () => {
    const response = await handleVerifyOtp(ctx.services, request({ phone: PHONE, code: "123456" }));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: { code: "code_expired" } });
  });
});

describe("POST /api/auth/logout", () => {
  it("ends the session and clears the cookie", async () => {
    await handleSendOtp(ctx.services, request({ phone: PHONE }));
    const login = await handleVerifyOtp(
      ctx.services,
      request({ phone: PHONE, code: ctx.sms.lastCode(PHONE) }),
    );
    const session = login.cookies?.[0]?.value;

    const response = await handleLogout(ctx.services, request({}, { session }));
    expect(response.status).toBe(200);
    expect(response.cookies).toEqual([{ name: SESSION.cookie, value: "", maxAge: 0 }]);
    expect(await getSessionUser(ctx.services.db, session, ctx.services.now())).toBeNull();
  });

  it("rejects a body with fields", async () => {
    expect((await handleLogout(ctx.services, request({ all: true }))).status).toBe(400);
  });
});
