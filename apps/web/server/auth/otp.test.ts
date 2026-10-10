import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { otpCodes, users } from "@/db/schema";

import { testServices } from "../testing/services";

import { sendOtp, verifyOtp } from "./otp";

const PHONE = "+919876543210";
const send = { phone: PHONE, ip: "203.0.113.7", device: "device-a", requestId: "req-1" };
const verify = { phone: PHONE, ip: "203.0.113.7", lang: "en", requestId: "req-2" } as const;

let ctx: Awaited<ReturnType<typeof testServices>>;
beforeEach(async () => {
  ctx = await testServices();
});

describe("sending a code", () => {
  it("sends six digits and stores only a hash", async () => {
    expect(await sendOtp(ctx.services, send)).toEqual({ ok: true });

    const code = ctx.sms.lastCode(PHONE);
    expect(code).toMatch(/^\d{6}$/);
    const [row] = await ctx.services.db.select().from(otpCodes).where(eq(otpCodes.phone, PHONE));
    expect(row?.codeHash).toMatch(/^[0-9a-f]{64}$/);
    expect(row?.codeHash).not.toContain(code);
  });

  it("asks for the bot challenge on the fourth send to one phone", async () => {
    for (let i = 0; i < 3; i += 1) {
      expect(
        await sendOtp(ctx.services, { ...send, device: `d${i}`, ip: `203.0.113.${i}` }),
      ).toEqual({ ok: true });
    }
    expect(await sendOtp(ctx.services, { ...send, device: "d9", ip: "203.0.113.9" })).toEqual({
      ok: false,
      reason: "challenge_required",
    });
    expect(ctx.sms.sent).toHaveLength(3);

    // The window passes and the phone can ask again.
    ctx.advance(15 * 60 + 1);
    expect(await sendOtp(ctx.services, send)).toEqual({ ok: true });
  });

  it("limits one device across many phones", async () => {
    for (let i = 0; i < 6; i += 1) {
      const phone = `+91987654321${i}`;
      expect(await sendOtp(ctx.services, { ...send, phone, ip: `198.51.100.${i}` })).toEqual({
        ok: true,
      });
    }
    expect(await sendOtp(ctx.services, { ...send, phone: "+919876543299" })).toEqual({
      ok: false,
      reason: "rate_limited",
    });
  });

  it("limits one IP across many phones and devices", async () => {
    for (let i = 0; i < 20; i += 1) {
      const phone = `+9198765432${String(i).padStart(2, "0")}`;
      expect(await sendOtp(ctx.services, { ...send, phone, device: `d${i}` })).toEqual({
        ok: true,
      });
    }
    expect(
      await sendOtp(ctx.services, { ...send, phone: "+919876549999", device: "fresh" }),
    ).toEqual({ ok: false, reason: "rate_limited" });
  });

  it("stops at the daily cap and logs an alert", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    // Fill the day's allowance directly, then one real send goes over it.
    await ctx.services.limiter.hit("otp:daily", 1, 1);
    for (let i = 0; i < 1999; i += 1) await ctx.services.limiter.hit("otp:daily", 2000, 86400);

    expect(await sendOtp(ctx.services, send)).toEqual({ ok: false, reason: "daily_cap" });
    expect(ctx.sms.sent).toHaveLength(0);
    expect(error.mock.calls.flat().join(" ")).toContain("otp.send.daily_cap");
    error.mockRestore();
  });

  it("never logs the code or the full phone number", async () => {
    const out = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    await sendOtp(ctx.services, send);
    const code = ctx.sms.lastCode(PHONE);
    await verifyOtp(ctx.services, { ...verify, code });

    const logged = out.mock.calls.flat().join(" ");
    out.mockRestore();
    expect(logged).toContain("otp.send.ok");
    expect(logged).toContain("+91********10");
    expect(logged).not.toContain(PHONE);
    expect(logged).not.toContain(code);
  });
});

describe("checking a code", () => {
  it("accepts the right code once and creates the user", async () => {
    await sendOtp(ctx.services, send);
    const code = ctx.sms.lastCode(PHONE);

    const result = await verifyOtp(ctx.services, { ...verify, code });
    expect(result.ok).toBe(true);
    const [user] = await ctx.services.db.select().from(users).where(eq(users.phone, PHONE));
    expect(result).toEqual({ ok: true, userId: user?.id });

    // A used code is gone.
    expect(await verifyOtp(ctx.services, { ...verify, code })).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("finds the same user on a later login", async () => {
    await sendOtp(ctx.services, send);
    const first = await verifyOtp(ctx.services, { ...verify, code: ctx.sms.lastCode(PHONE) });
    await sendOtp(ctx.services, send);
    const second = await verifyOtp(ctx.services, {
      ...verify,
      lang: "te",
      code: ctx.sms.lastCode(PHONE),
    });

    expect(second).toEqual(first);
    const rows = await ctx.services.db.select().from(users).where(eq(users.phone, PHONE));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.lang).toBe("te");
  });

  it("rejects a wrong code and still accepts the right one after it", async () => {
    await sendOtp(ctx.services, send);
    const code = ctx.sms.lastCode(PHONE);
    const wrong = code === "000000" ? "000001" : "000000";

    expect(await verifyOtp(ctx.services, { ...verify, code: wrong })).toEqual({
      ok: false,
      reason: "wrong_code",
    });
    expect((await verifyOtp(ctx.services, { ...verify, code })).ok).toBe(true);
  });

  it("kills the code after five wrong tries, even for the right code", async () => {
    await sendOtp(ctx.services, send);
    const code = ctx.sms.lastCode(PHONE);
    const wrong = code === "000000" ? "000001" : "000000";

    for (let i = 0; i < 5; i += 1) {
      expect(await verifyOtp(ctx.services, { ...verify, code: wrong })).toEqual({
        ok: false,
        reason: "wrong_code",
      });
    }
    expect(await verifyOtp(ctx.services, { ...verify, code })).toEqual({
      ok: false,
      reason: "too_many_attempts",
    });
  });

  it("gives parallel guesses no more than five tries in total", async () => {
    await sendOtp(ctx.services, send);
    const code = ctx.sms.lastCode(PHONE);
    const wrong = code === "000000" ? "000001" : "000000";

    const results = await Promise.all(
      Array.from({ length: 12 }, () => verifyOtp(ctx.services, { ...verify, code: wrong })),
    );
    expect(results.filter((r) => !r.ok && r.reason === "wrong_code")).toHaveLength(5);
    expect(results.filter((r) => !r.ok && r.reason === "too_many_attempts")).toHaveLength(7);
  });

  it("expires a code after five minutes", async () => {
    await sendOtp(ctx.services, send);
    const code = ctx.sms.lastCode(PHONE);

    ctx.advance(5 * 60);
    expect(await verifyOtp(ctx.services, { ...verify, code })).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("cancels the old code when a new one is sent", async () => {
    await sendOtp(ctx.services, send);
    const old = ctx.sms.lastCode(PHONE);
    await sendOtp(ctx.services, send);
    const fresh = ctx.sms.lastCode(PHONE);

    if (old !== fresh) {
      expect(await verifyOtp(ctx.services, { ...verify, code: old })).toEqual({
        ok: false,
        reason: "wrong_code",
      });
    }
    expect((await verifyOtp(ctx.services, { ...verify, code: fresh })).ok).toBe(true);
  });

  it("does not accept a code sent to another phone", async () => {
    const other = "+919876500000";
    await sendOtp(ctx.services, send);
    await sendOtp(ctx.services, { ...send, phone: other, device: "device-b" });

    expect(
      await verifyOtp(ctx.services, { ...verify, phone: other, code: ctx.sms.lastCode(PHONE) }),
    ).toEqual(
      ctx.sms.lastCode(PHONE) === ctx.sms.lastCode(other)
        ? { ok: true, userId: expect.any(String) as string }
        : { ok: false, reason: "wrong_code" },
    );
  });

  it("with no code on record, says expired", async () => {
    expect(await verifyOtp(ctx.services, { ...verify, code: "123456" })).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("limits verify calls from one IP", async () => {
    for (let i = 0; i < 30; i += 1) await verifyOtp(ctx.services, { ...verify, code: "123456" });
    expect(await verifyOtp(ctx.services, { ...verify, code: "123456" })).toEqual({
      ok: false,
      reason: "rate_limited",
    });
  });
});
