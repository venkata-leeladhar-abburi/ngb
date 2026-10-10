import { connectLocal } from "../db/client";
import { seedPrograms } from "../db/seed";
import { MemoryRateLimiter } from "../rateLimit";
import type { Services } from "../services";
import type { SmsSender } from "../sms";

/** An SMS sender that keeps what it was asked to send, so a test can read the code. */
export class RecordingSms implements SmsSender {
  readonly sent: { phone: string; code: string }[] = [];

  sendOtp(phone: string, code: string) {
    this.sent.push({ phone, code });
    return Promise.resolve();
  }

  /** The last code sent to a phone. */
  lastCode(phone: string): string {
    const last = this.sent.findLast((message) => message.phone === phone);
    if (!last) throw new Error(`No code was sent to ${phone}`);
    return last.code;
  }
}

/**
 * Services for a test: a throwaway in-memory Postgres with the real migrations and seed, in-memory
 * limits, a recording SMS sender, and a clock the test moves with `advance`.
 */
export async function testServices(start = new Date("2026-10-10T10:00:00Z")) {
  let time = start.getTime();
  const now = () => new Date(time);
  const sms = new RecordingSms();
  const db = await connectLocal();
  await seedPrograms(db);
  const services: Services = {
    db,
    limiter: new MemoryRateLimiter(now),
    sms,
    secret: "test-secret-test-secret-test-secret-1234",
    now,
  };
  return {
    services,
    sms,
    advance: (seconds: number) => {
      time += seconds * 1000;
    },
  };
}
