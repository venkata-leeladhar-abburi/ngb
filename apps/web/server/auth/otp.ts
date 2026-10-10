import "server-only";

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";

import { otpCodes, users } from "@/db/schema";

import { log } from "../log";
import type { Services } from "../services";

import { OTP, SEND_LIMITS, VERIFY_LIMITS } from "./limits";
import { maskPhone } from "./phone";

/** Only the HMAC of a code is stored, keyed by the server secret and tied to the phone it was sent to. */
function hashCode(secret: string, phone: string, code: string): Buffer {
  return createHmac("sha256", secret).update(`${phone}:${code}`).digest();
}

export type SendResult =
  { ok: true } | { ok: false; reason: "rate_limited" | "challenge_required" | "daily_cap" };

interface SendInput {
  phone: string;
  ip: string;
  device: string;
  requestId: string;
}

/**
 * Sends a fresh 6-digit code to a phone. Checks the IP, device, phone and daily limits first; a new
 * code cancels any earlier one for that phone. After 3 sends to one phone it answers
 * `challenge_required`: the bot challenge is not built yet, so this fails closed.
 */
export async function sendOtp(services: Services, input: SendInput): Promise<SendResult> {
  const { db, limiter, sms, secret, now } = services;
  const { phone, ip, device, requestId } = input;
  const masked = maskPhone(phone);

  const { perIp, perDevice, perPhone, daily } = SEND_LIMITS;
  if (!(await limiter.hit(`otp:ip:${ip}`, perIp.limit, perIp.windowSeconds)).allowed) {
    log("warn", "otp.send.limited", { requestId, by: "ip" });
    return { ok: false, reason: "rate_limited" };
  }
  if (
    !(await limiter.hit(`otp:device:${device}`, perDevice.limit, perDevice.windowSeconds)).allowed
  ) {
    log("warn", "otp.send.limited", { requestId, by: "device" });
    return { ok: false, reason: "rate_limited" };
  }
  if (!(await limiter.hit(`otp:phone:${phone}`, perPhone.limit, perPhone.windowSeconds)).allowed) {
    log("warn", "otp.send.challenge", { requestId, phone: masked });
    return { ok: false, reason: "challenge_required" };
  }
  if (!(await limiter.hit("otp:daily", daily.limit, daily.windowSeconds)).allowed) {
    // The spend cap: someone must look at this (SMS-pumping fraud or a real launch spike).
    log("error", "otp.send.daily_cap", { requestId });
    return { ok: false, reason: "daily_cap" };
  }

  const code = String(randomInt(0, 10 ** OTP.digits)).padStart(OTP.digits, "0");
  const time = now();
  await db.transaction(async (tx) => {
    await tx
      .update(otpCodes)
      .set({ consumedAt: time })
      .where(and(eq(otpCodes.phone, phone), isNull(otpCodes.consumedAt)));
    await tx.insert(otpCodes).values({
      phone,
      codeHash: hashCode(secret, phone, code).toString("hex"),
      expiresAt: new Date(time.getTime() + OTP.ttlSeconds * 1000),
      createdAt: time,
    });
  });
  await sms.sendOtp(phone, code);
  log("info", "otp.send.ok", { requestId, phone: masked });
  return { ok: true };
}

export type VerifyResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "wrong_code" | "expired" | "too_many_attempts" | "rate_limited" };

interface VerifyInput {
  phone: string;
  code: string;
  ip: string;
  lang: "en" | "te";
  requestId: string;
}

/**
 * Checks a code. The try is counted before the comparison (one atomic UPDATE), so parallel guesses
 * cannot get more than 5 tries. A right code is used up and the phone's user is created or found.
 */
export async function verifyOtp(services: Services, input: VerifyInput): Promise<VerifyResult> {
  const { db, limiter, secret, now } = services;
  const { phone, code, ip, lang, requestId } = input;
  const masked = maskPhone(phone);

  const { perIp } = VERIFY_LIMITS;
  if (!(await limiter.hit(`otp:verify:ip:${ip}`, perIp.limit, perIp.windowSeconds)).allowed) {
    log("warn", "otp.verify.limited", { requestId, by: "ip" });
    return { ok: false, reason: "rate_limited" };
  }

  const time = now();
  const [latest] = await db
    .select({ id: otpCodes.id, expiresAt: otpCodes.expiresAt, attempts: otpCodes.attempts })
    .from(otpCodes)
    .where(and(eq(otpCodes.phone, phone), isNull(otpCodes.consumedAt)))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);
  if (!latest || latest.expiresAt <= time) {
    log("info", "otp.verify.expired", { requestId, phone: masked });
    return { ok: false, reason: "expired" };
  }

  const [counted] = await db
    .update(otpCodes)
    .set({ attempts: sql`${otpCodes.attempts} + 1` })
    .where(
      and(
        eq(otpCodes.id, latest.id),
        isNull(otpCodes.consumedAt),
        lt(otpCodes.attempts, OTP.maxAttempts),
      ),
    )
    .returning({ codeHash: otpCodes.codeHash });
  if (!counted) {
    log("warn", "otp.verify.too_many", { requestId, phone: masked });
    return { ok: false, reason: "too_many_attempts" };
  }

  const expected = Buffer.from(counted.codeHash, "hex");
  const given = hashCode(secret, phone, code);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    log("info", "otp.verify.wrong", { requestId, phone: masked });
    return { ok: false, reason: "wrong_code" };
  }

  const userId = await db.transaction(async (tx) => {
    // Use the code up; if a parallel request already did, this one loses.
    const used = await tx
      .update(otpCodes)
      .set({ consumedAt: time })
      .where(and(eq(otpCodes.id, latest.id), isNull(otpCodes.consumedAt)))
      .returning({ id: otpCodes.id });
    if (used.length === 0) return null;
    const [user] = await tx
      .insert(users)
      .values({ phone, lang })
      // The phone is the account: a returning person keeps their row.
      .onConflictDoUpdate({ target: users.phone, set: { lang } })
      .returning({ id: users.id });
    return user?.id ?? null;
  });
  if (!userId) return { ok: false, reason: "expired" };

  log("info", "otp.verify.ok", { requestId, phone: masked });
  return { ok: true, userId };
}
